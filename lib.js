import { Audio } from 'expo-av'
import {AsyncStorage} from 'react-native';

export function loadKit(context) {
    switch (context.set) {
        case "standard":
            var beats = loadStandard()
            break;
        case "toms":
            var beats = loadToms()
            break;
    }
    return beats
}

export async function loadSounds(beats, pattern) {
    await unloadSounds(beats)
    for (var i=0; i < beats.length; i++) {
        if (findBeat(beats[i].name, pattern)) {
            beats[i].soundobject =  new Audio.Sound()
            await beats[i].soundobject.loadAsync(beats[i].source)
            await beats[i].soundobject.setPositionAsync(0)
            beats[i].loaded = true
        }
    }
    return beats
}

export async function unloadSounds(beats) {
    var rBeats = beats
    for (var j=0;j<rBeats.length;j++){
        if (rBeats[j].loaded) {
            await rBeats[j].soundobject.unloadAsync()
            .then((status) => {
                if (status.error) {
                    console.log(status.error)
                }
                rBeats[j].loaded = status.isLoaded
            })
        }
    }
    return rBeats
}

export async function getContext() {
    var c = await AsyncStorage.getItem('context')

    if (c) {
        return JSON.parse(c)
    }
    else {
        var c = {
            "set": "standard",
            "mode": "loop",
            "patternName": "sample1",
            "BPM": 110
        }
        postContext(c)
        return c
    }
}

export async function postContext(context) {
    await AsyncStorage.setItem('context', JSON.stringify(context))
    return context
}

export async function postPattern(patterns) {
    await AsyncStorage.setItem('patterns', JSON.stringify(patterns))
    return patterns
}

export async function getPattern(name) {
    var patterns = await loadPatterns()
    for (var i=0;i<patterns.length;i++){
        if (patterns[i].name==name) {
            return {patterns: patterns, index: i}
        }
    }
    return null;
}

export async function loadPatterns() {
    try {
        var x = await AsyncStorage.getItem('patterns')
        if (x) {
            var p = JSON.parse(x)
        } else {
            var p = 
                [
                    {
                        "name": "sample1",
                        "owner": "sys",
                        "set":"standard",
                        "BPM": 110,
                        "streams": [
                        ["kick","kick","kick","kick"],
                        ["none","hat","none","hat","none","hat","none","none"],
                        ["none","none","none","none","none","none","none","none","none","none","none","none","none","none","snare","snare"]
                        ]
                    },
                    {
                        "name": "sample2",
                        "owner": "sys",
                        "set":"standard",
                        "BPM": 100,
                        "streams": [
                        ["snare","none","snare","none"],
                        ["none","none","hat","hat","none","none","hat","none"],
                        ["none","none","none","none","none","none","none","none","none","none","none","none","none","none","click","click"]
                        ]
                    },
                    {
                        "name": "sample3",
                        "owner": "sys",
                        "set":"toms",
                        "BPM": 100,
                        "streams": [
                        ["floor","none","floor","none","floor","none","floor","none"],
                        ["none","none","clap","clap","none","none","clap","clap","none","none","clap","clap","none","none","clap","clap"],
                        ["none","none","none","none","none","none","none","none","none","none","none","none","none","none","none","none","none","none","none","none","none","none","none","none","none","none","none","none","none","none","none","none"]
                        ]
                    }
                ]
        }

        AsyncStorage.setItem('patterns', JSON.stringify(p), (err)=> {
            if(err){
                throw err
            }
        })
        return p
    }
    catch(error) {
    }
}

function loadStandard() {
    var beats = 
        [
            {"name": "click", "source": require('./data/standard/click.wav'), "soundobject": null, "loaded": false},
            {"name": "hat", "source": require('./data/standard/hat.wav'), "soundobject": null, "loaded": false},
            {"name": "kick", "source": require('./data/standard/kick.wav'), "soundobject": null, "loaded": false},
            {"name": "snare", "source": require('./data/standard/snare.wav'), "soundobject": null, "loaded": false},
        ];
    return beats;
}

function loadToms() {
    var beats = 
        [
            {"name": "floor", "source": require('./data/toms/floor.wav'), "soundobject": null, "loaded": false},
            {"name": "high", "source": require('./data/toms/high.wav'), "soundobject": null, "loaded": false},
            {"name": "mid", "source": require('./data/toms/mid.wav'), "soundobject": null, "loaded": false},
            {"name": "clap", "source": require('./data/toms/clap.wav'), "soundobject": null, "loaded": false}
        ];
    return beats;
}

function findBeat(name, pattern) {
    for (var j=0; j<pattern.streams.length; j++) {
        for (var k=0; k<pattern.streams[j].length; k++) {
            if (pattern.streams[j][k]==name) {
                return true
            }
        }
    }
    return false;
}

export function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.5)';
    }
    throw new Error('Bad Hex');
}

export async function appReset(){
    var x = await AsyncStorage.removeItem('context')
    var x = await AsyncStorage.removeItem('patterns')
}