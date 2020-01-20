import React, {Component} from 'react';
import { TouchableOpacity, ActivityIndicator, Image, Text, View, StatusBar, Alert, ImageBackground, ScrollView } from 'react-native'
import { Overlay, Icon, Header } from "react-native-elements"
import { Audio } from 'expo-av'
import { loadKit, loadSounds, appReset, getContext, getPattern, postContext, postPattern} from '../lib.js'
import { BPMDial, ActionPicker, ActionButton, PatternView, BeatDisplay, PlayerOptions, PopupMenu, BackgroundTaskRunner } from '../src/Elements.js'
import StyleSheet, { appColorLight, appColorSelected, patternColors, screenHeight } from '../src/styles.js'
import aboutText from '../about.js'

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beats: [],
      playing: false,
      patterns: [],
      patternRow: 0, 
      patternCell: 0,
      cellColor: patternColors[0][0],
      isLoading: true,
      showMenu: false,
      currentBeat: [{name:"", index:0}, {name:"", index:0}, {name:"", index:0}],
      isApplying: false,
      playerOption: 0,
      playTimer: null,
      playerHeight: screenHeight/4,
      patternLoad: true,
      showAbout: false,
      aboutText: aboutText      
    }
    this.lastBeat = null
  }
  static navigationOptions = ({ navigation }) => {
    return {
       header: () => null
    } 
}


  async componentDidMount() {
      StatusBar.setHidden(true);
      await Expo.Font.loadAsync({'FontAwesome': require('../fonts/FontAwesome.ttf')})
      await Expo.Font.loadAsync({'material': require('../fonts/MaterialIcons.ttf')})
      await Expo.Font.loadAsync({'digital7': require('../fonts/digital-7.ttf')})
      .then (async () => {
        await this.appLoad()
      })
  }

  appLoad = async () => {
    await getContext()
    .then((contextData) => {
      this.setState({context: contextData}, async () => {
        await getPattern(this.state.context.patternName)
        .then((patternData) => {
          this.setState({
            patterns: patternData.patterns,
            aboutText: aboutText, 
            pattern: patternData.patterns[patternData.index]}, async () => {
            this.apply(this.state.pattern, 'update')
            var c=[{name:"", index:0}, {name:"", index:0}, {name:"", index:0}]
            this.setState({beats: loadKit(this.state.context), showPickList: false, currentBeat: c, isLoading: false})
          })  
        })
      })
    })
  }

  play = async () => {
    var pattern = this.state.pattern
    var beats = this.state.beats
    var beatCount = -1
    var lastBeat = null
    var int = (60000/this.state.context.BPM)*(pattern.streams[0].length)
    console.log(`interval ${int}`)
    var d = new Date()
    console.log(`start   @ ${d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+":"+d.getMilliseconds()}`)
    /*
    if (this.state.context.mode == "loop") {
      if (this.state.playTimer) clearTimeout(this.state.playTimer)
      this.setState({playTimer:setTimeout(()=>{this.play()},int)})
    }
    */
    var c=[{name:"", index:0}, {name:"", index:0}, {name:"", index:0}]
    while (beatCount<pattern.streams[2].length) {
      var playNow = lastBeat?new Date()-lastBeat>=(60000/this.state.context.BPM)/4?true:false:true
      if (playNow) {
        beatCount++
        if ((Math.floor(beatCount/4)*4)==beatCount) {
          c[0].name=this.state.pattern.streams[0][beatCount/4]
          c[0].index=Math.floor(beatCount/4)
          this.playBeat(pattern.streams[0][beatCount/4], beats, beatCount)
        }
        if ((Math.floor(beatCount/2)*2)==beatCount) {
          c[1].name=this.state.pattern.streams[1][beatCount/2]
          c[1].index=Math.floor(beatCount/2)
          this.playBeat(pattern.streams[1][beatCount/2], beats, beatCount)
        }
        c[2].name=this.state.pattern.streams[2][beatCount]
        c[2].index=beatCount
        this.playBeat(pattern.streams[2][beatCount], beats, beatCount)
        lastBeat = new Date()
      }
    }
    //var d = new Date()
    //console.log(`end     @ ${d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+":"+d.getMilliseconds()}`)
    if (!(this.state.context.mode == "loop" && this.state.playing)) {
      this.autoStop()
    } else {
      //this.setState({playing:true}, (() => {
        this.play()
      //}))
    }
  }
  
  playBeat = (name, beats, count) => {
    if (name!=="none") {
      for (var j=0;j<beats.length;j++){
        if (beats[j].name==name){
          var d = new Date()
          console.log(`play   beat ${count}: ${name} @ ${d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+":"+d.getMilliseconds()}`)
          try {
            beats[j].soundobject.replayAsync()
            var d = new Date()
            console.log(`played  beat ${count}: ${name} @ ${d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+":"+d.getMilliseconds()}`)
          } catch(e) {
            console.log(`fail!!! ${e}`)
          }
          return
        }
      }
    }
  }

  autoStart = async () => {
    if (this.state.patternLoad) {
        await loadSounds(loadKit(this.state.context), this.state.pattern)
        .then ((beats) => {
          this.setState({
            patternLoad: false,
            beats: beats,
            playing: true,
            currentBeat:[{name:"", index:0}, {name:"", index:0}, {name:"", index:0}],
            patternRow: 0,
            patternCell: 0
          })  
        })
    }
    else {
      this.setState({
        playing: true,
        currentBeat:[{name:"", index:0}, {name:"", index:0}, {name:"", index:0}],
        patternRow: 0,
        patternCell: 0
      })  
    }
  }

  autoStop = () => {
    var d = new Date()
    clearTimeout(this.state.playTimer)
    this.setState({
      playing: false,
      currentBeat:[{name:"", index:0}, {name:"", index:0}, {name:"", index:0}],
      patternRow: 0,
      patternCell: 0
    })
  }

  updateBPM = async (incrValue) => {
    var context = this.state.context
    if ((context.BPM+incrValue)>=20 && (context.BPM+incrValue)<=200) {
      context.BPM = context.BPM+incrValue
      this.setState({context: context}, () => {
        if (this.state.pattern.owner!=="sys") postContext(context)
      })
    }
  }
  setBPM = (val) => {
    var context = this.state.context
    context.BPM = val
    this.setState({context: context}, () => {
      postContext(context)
    })
}
  updateMode = async (modeValue) => {
    if (modeValue!==this.state.context.mode) {
      var context = this.state.context
      context.mode = modeValue
      this.setState({context: context}, () => {
        postContext(context)
        this.hidePickList()
      })
    }
  }

  updatePattern = (name) => {
    for (i=0;i<this.state.patterns.length;i++) {
      if (this.state.patterns[i].name == name) {
        var pattern = this.state.patterns[i]
        this.apply(pattern,'update')
      }
    } 
    this.hidePickList()
  } 

  updateDrumKit = (drumKit) => {
    Alert.alert(
      'Change Drum Kit?', 
      `This will erase all beats in pattern! ${this.state.pattern.name}`,
      [
        {text: 'YES', onPress: () => {
          var pattern = this.state.pattern
          pattern.set = drumKit
          pattern.streams = this.clearPattern(pattern.streams[0].length)
          this.apply(pattern, 'update')
        }},
        {text: 'NO', onPress: () => null}
      ],
      { cancelable: false }
    )
    this.hidePickList()
  }

  clearPattern = (count) => {
    var streams = []
    for (var i=0; i<3; i++) {
      var stream = []
      for (var j=0; j<(count*(2**i)); j++) {
        stream.push("none")
      }
      streams.push(stream)
    }
    return streams
  }

  updateBeats = (beatCount) => {
    Alert.alert(
      'Change Beat Count?',
      `This will erase all beats in pattern ${this.state.pattern.name}!`,
      [
        {text: 'YES', onPress: () => {
          var pattern = this.state.pattern
          pattern.streams = this.clearPattern(beatCount)
          this.apply(pattern, 'update')
        }},
        {text: 'NO', onPress: () => null}
      ],
      { cancelable: false }
    )
    this.hidePickList()
  }

  createPattern = () => {
    var patterns = this.state.patterns
    var patternIndex=0
    do {
      var found=false
      patternIndex++
      for (var i=0;i<patterns.length;i++) {
        if (patterns[i].name=='custom'+patternIndex) found=true
      }
    } while(found)
    var p = {
      "name": 'custom'+patternIndex, 
      "owner": 'user',
      "title": '',
      "set": 'standard',
      "BPM": 110,
      "streams": this.clearPattern(4)
    }
    //console.log(`new pattern ${p.name}`)
    this.apply(p, 'add')
  }

  apply = (pattern, action) => {
    this.setState({isApplying: true}, () => {
      var patterns = [...this.state.patterns]
    
      if (action=='add') {
        patterns.push(pattern)
      } else {
        for (var i=0;i<patterns.length;i++){
          if (patterns[i].name==pattern.name) {
            if (action=='delete') {
              patterns.splice(i, 1)
            } else {
              patterns[i]=pattern
            }
          }
        }
      }
      this.setState({patterns: patterns}, async () => {
        await postPattern(patterns)
        .then (async (patterns) => {
          var c=[{name:"", index:0}, {name:"", index:0}, {name:"", index:0}]
          var p = (action=='delete'?patterns[0]:pattern)
          var context = this.state.context
          var beats = this.state.beats
          var xKit=context.set
          if (context.patternName !== p.name)
          {
            context.BPM = p.BPM
            context.patternName = p.name
            context.set = p.set
          }
          if (xKit!==context.set) beats = loadKit(context)
          await postContext(context)
          .then((context) => {
            if (action=='add') this.setState({currentBeat: c, patternRow: 0, patternCell: 0, beats: beats})  
            this.setState({context: context, pattern: p, isApplying:false, patternLoad: true, beats: beats})
          })
        })
      })
    })
  }

  setPatternCell = (row, cell, bgColor) => {
    if (!this.state.playing) {
      this.setState({patternRow: row, patternCell: cell, cellColor: bgColor, playerOption: 1})
    }
  }

  updateBeatName = (nameValue) => {
    if (nameValue!==this.state.pattern.streams[this.state.patternRow][this.state.patternCell]) {
      var pattern = this.state.pattern
      pattern.streams[this.state.patternRow][this.state.patternCell] = nameValue
      this.apply(pattern,'update')
    }
    this.hidePickList()
  }

  playCurrentBeat = async () => {
    if (this.state.pattern.streams[this.state.patternRow][this.state.patternCell]!=='none') {
      for (j=0;j<this.state.beats.length;j++) {
        var beat = this.state.beats[j]
        if (beat.name==this.state.pattern.streams[this.state.patternRow][this.state.patternCell]){
          beat.soundobject =  new Audio.Sound()
          await beat.soundobject.loadAsync(beat.source)
          beat.soundobject.playAsync()
        }
      }
    }
  }

  setPlayerOption = (index) => {
    this.setState({playerOption: index})
  }

  loadPickList = (items, value, action) => {
    var itemLines = []
    for (var i=0; i<items.length; i++) {
      const ind=i
      itemLines.push(
            <TouchableOpacity
                style={items[i]==value?StyleSheet.overlaySelected:StyleSheet.overlayItem}
                key={i}
                dataKey={items[i]}
                onPress={(e) => action(`${items[ind]}`)}>
                <Text style={items[i]==value?StyleSheet.overlaySelectedText:StyleSheet.overlayItemText}>
                    {items[i]}
                </Text>
            </TouchableOpacity>
        )
    }
    this.setState({itemLines: itemLines, showPickList: true})
  }

  hidePickList = () => {
    this.setState({showPickList: false})
  }

  hideMenu = () => {
    this.setState({showMenu: false})
  }

  resetApp = () => {
    Alert.alert(
      'Reset App?',
      `This will erase all custom patterns!`,
      [
        {text: 'YES', onPress: () => {
          this.setState({isApplying: true}, async () => {
            await appReset()
            await this.appLoad()
          })
        }},
        {text: 'NO', onPress: () => null}
      ],
      { cancelable: false }
    )
    this.setState({showMenu: false})
  }

  aboutApp = () => {
      this.setState({showAbout: true, showMenu: false})
  }
  
  hideAbout = () => {
    this.setState({showAbout: false})
  }

  render() {
    var patternNames=[]
    this.state.patterns.map((pattern) => {patternNames.push(pattern.name)})
    var beatNames = ['none']
    this.state.beats.map((beat) => {beatNames.push(beat.name)})

    if (this.state.isLoading) return (
      <View style={StyleSheet.container}>
            <Image
              style={StyleSheet.bgImage}
              source={require('../assets/images/drumkit.png')} />
      </View>);
    else {
      return (
        <ImageBackground
          style={StyleSheet.bgImage}
          source={require('../assets/images/drumkit.png')}
        >
        <Header
          containerStyle={StyleSheet.headerBar}
          leftComponent={{ icon: 'menu', color: '#fff', size: 20, onPress: () => this.setState({showMenu: !this.state.showMenu}) }}
          centerComponent={{ text: 'Percuss v0.01', style: { color: appColorLight, fontSize: 24, fontWeight: "bold"  } }}
        />
        <View style={StyleSheet.container}>
          <View style={StyleSheet.topSection}>
            <BPMDial
              BPMValue = {this.state.context.BPM}
              modeValue = {this.state.context.mode}
              total = {this.state.pattern.streams[0].length}
              playing = {this.state.playing}
              increment = {this.updateBPM}
              set = {this.setBPM}
              save = {this.saveBPM}
            />
            <PatternView
                pattern={this.state.pattern}
                mode={this.state.context.mode}
                playing={this.state.playing}
                current={this.state.currentBeat}
                action={this.setPatternCell}
                row={this.state.patternRow}
                cell={this.state.patternCell}
              />
              <BackgroundTaskRunner />
          </View>
          <View style={StyleSheet.bottomSection}>
            <PlayerOptions
                index={this.state.playerOption}
                action={this.setPlayerOption}
                playing={this.state.playing}
            />
            {this.state.playerOption==0 &&
              <View style={StyleSheet.section}>
                <ActionPicker
                    label = 'Mode'
                    value = {this.state.context.mode}
                    action = {this.updateMode}
                    items = {["loop","one time"]}
                    enabled = {!this.state.playing}
                    color = {appColorLight}
                    load = { this.loadPickList }
                  />
                <ActionPicker
                    label = 'Pattern'
                    value = {this.state.pattern.name}
                    action={this.updatePattern}
                    items={patternNames}
                    enabled = {!this.state.playing}
                    color = {appColorLight}
                    load = { this.loadPickList }
                  />
                <ActionButton
                  action = {this.state.playing?(this.state.context.mode=="loop")?this.autoStop:this.autoStop:this.autoStart}
                  label = {this.state.playing?'Pause':'Play Loop'}
                  icon = {this.state.playing?'pause':'play'}
                  enabled = {this.state.playing&&(this.state.context.mode!=="loop")?false:true}
                />
              </View>
            }
            {this.state.playerOption==1 &&
              <View style={StyleSheet.section}>
                <BeatDisplay 
                  row = {this.state.patternRow}
                  cell = {this.state.patternCell}
                />
                <ActionPicker
                  label = 'Beat'
                  value = {this.state.pattern.streams[this.state.patternRow][this.state.patternCell]}
                  action={this.updateBeatName}
                  items={beatNames}
                  enabled = {!(this.state.playing || this.state.pattern.owner=='sys')}
                  color = {this.state.playing?appColorLight:this.state.cellColor}
                  load = { this.loadPickList }
                />
                <ActionButton
                  action = {this.playCurrentBeat}
                  label = 'Play Beat'
                  icon = {'play'}
                  enabled = {!(this.state.playing||this.state.pattern.streams[this.state.patternRow][this.state.patternCell]=='none')}
                />
              </View>
            }
            {this.state.playerOption==2 &&
              <View style={StyleSheet.section}>
                <ActionPicker
                  label = 'Drum kit'
                  value = {this.state.pattern.set}
                  action={this.updateDrumKit}
                  items={["standard","toms"]}
                  enabled = {!(this.state.playing || this.state.pattern.owner=='sys')}
                  color = {appColorLight}
                  load = { this.loadPickList }
                />
                <ActionPicker
                  label = 'Beats'
                  value = {this.state.pattern.streams[0].length}
                  action = {this.updateBeats}
                  items = {["4","8"]}
                  enabled = {!(this.state.playing || this.state.pattern.owner=='sys')}
                  color = {appColorLight}
                  load = { this.loadPickList }
                />
                <ActionButton
                  action = {this.createPattern}
                  label = 'New Loop'
                  icon = {'plus-square'}
                  enabled = {!this.state.playing}
                />
              </View>
            }
          </View>
        </View>
        <Overlay
          isVisible={this.state.isApplying}
          overlayStyle={StyleSheet.applying}>
          <View style={StyleSheet.spinnerContainer, StyleSheet.horizontal}>
            <ActivityIndicator size="large" color={appColorLight} />
          </View>
        </Overlay>
        <Overlay
          onBackdropPress={() => this.hidePickList()}
          isVisible={this.state.showPickList}
          overlayStyle={StyleSheet.overlay}
          height={screenHeight/2}>
          <View style={StyleSheet.pickListContainer}>
              <ScrollView contentContainerStyle={StyleSheet.overlayScroll}>
                  { this.state.itemLines }
              </ScrollView>
          </View>
        </Overlay>
        <Overlay
          onBackdropPress={() => this.hideAbout()}
          isVisible={this.state.showAbout}
          overlayStyle={StyleSheet.overlay}>
          <View style={StyleSheet.pickListContainer}>
              <ScrollView contentContainerStyle={StyleSheet.overlayScroll}>
                <Text style={StyleSheet.aboutText}>
                  { this.state.aboutText }
                </Text>
              </ScrollView>
          </View>
        </Overlay>
        {this.state.showMenu &&
        <PopupMenu 
          reset = {this.resetApp}
          about = {this.aboutApp}/>
        }
        </ImageBackground>
      )
    }
  }
}
