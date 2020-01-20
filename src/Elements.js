import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity, WebView } from "react-native";
import { Icon, ButtonGroup, Slider} from "react-native-elements"
import StyleSheet, { appColorLight, appColorDisabled, appColorDark, patternColors, appColorSelected, sectionWidth, appColorClear } from '../src/styles.js'
import styles, {sectionHeight} from '../src/styles.js'
import {screenHeight} from '../src/styles.js'
import {contentWidth} from '../src/styles.js'
import { colorPalette } from '../palette.js'
import { tsNonNullExpression } from '@babel/types';

export class Section extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
                <View style={StyleSheet.section} />
        )
    }
}

export class BPMDial extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        handlePress = (incr, pressed) => {
            this.props.pressed(pressed, incr)
        }
        var BPM=this.props.BPMValue

        return (
            <View style={StyleSheet.BPMSection}>
                <View style={StyleSheet.dialArea}>
                    <View style={StyleSheet.BPMContainer}>
                        <TouchableOpacity
                            style={StyleSheet.dialButton}
                            onPress={() => {this.props.increment(-1)}}
                            >
                            <Icon
                                name='minus'
                                type='font-awesome'
                                size={24}
                                color={appColorDark}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={StyleSheet.BPMTextContainer}>
                        <Text style={StyleSheet.BPMText}>{BPM}</Text>
                    </View>
                    <View style={StyleSheet.BPMContainer}>
                        <TouchableOpacity
                            style={StyleSheet.dialButton}
                            onPress={() => {this.props.increment(1)}}
                            >
                            <Icon
                                name='plus'
                                type='font-awesome'
                                size={24}
                                color={appColorDark}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.sliderArea}>
                    <Slider
                        value={BPM}
                        minimumValue={20}
                        maximumValue={200}
                        minimumTrackTintColor={appColorSelected}
                        maximumTrackTintColor={appColorLight}
                        thumbTintColor={appColorDark}
                        step={1}
                        style={{width: sectionWidth-50}}
                        onValueChange={(value) => {this.props.set(value)}}
                        />
                </View>
            </View>
        )
    }
}

export class PatternView extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        patternRow = (row, palette) => {
            var cells = []
            const innerHeight=((sectionHeight/2)/this.props.pattern.streams.length)/2
            const qWidth = contentWidth/this.props.pattern.streams[2].length
    
            for (var j=0; j<this.props.pattern.streams[row].length; j++) {
                const cell = j
                cells.push(
                    <View
                        activeOpacity={1}
                        width = {qWidth*(2**(2-row))}
                        key={cell}
                        style = {{
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            backgroundColor: this.props.playing?palette[cell]:this.props.row==row&&this.props.cell==cell?appColorLight:palette[cell]}}
                    >
                        <TouchableOpacity
                            onPress = {()=>{this.props.action(row, cell, palette[cell])}}
                            style = {{flex:1, alignItems: 'center', justifyContent: 'center',
                                      width: Math.round(contentWidth/this.props.pattern.streams[row].length),
                                      borderWidth: 1, borderColor: appColorDark
                                      }}>
                                <View
                                    width = {(5*(this.props.pattern.streams.length-row))+1}
                                    height = {(5*(this.props.pattern.streams.length-row))+1}
                                    style = {{
                                        backgroundColor: this.props.pattern.streams[row][cell]!=='none'?appColorLight:
                                        this.props.playing?palette[cell]:this.props.row==row&&this.props.cell==cell?appColorLight:palette[cell],
                                        borderRadius: ((5*(this.props.pattern.streams.length-row))+1)/2,
                                        borderWidth: this.props.pattern.streams.length-row,
                                        borderColor: this.props.pattern.streams[row][cell]!=='none'?appColorDark:
                                        this.props.playing?palette[cell]:this.props.row==row&&this.props.cell==cell?appColorLight:palette[cell],
                                        paddingBottom: 5
                                    }}>
                                </View>
                        </TouchableOpacity>
                    </View>
                )
            }
            return cells
        }

        patternRows = () => {
            var rows = []
            for (var i=0; i<this.props.pattern.streams.length; i++) {
                const ind = i
                var palette = colorPalette(patternColors[ind][0], patternColors[ind][1], this.props.pattern.streams[ind].length)
                rows.push(
                    <View key={i}
                        style={StyleSheet.patternProgressRow}
                        height = {Math.round((sectionHeight/2)/this.props.pattern.streams.length)-10}
                        width = { contentWidth }>
                        {  patternRow(ind, palette) }
                    </View>
                )
            }
            return rows
        }
        return (
            <View style={StyleSheet.patternSection}>
                <View style={StyleSheet.patternProgress}>
                    { patternRows() }
                </View>
            </View>
        )
    }
}
export class BackgroundTaskRunner extends Component {
    constructor(props) {
        super(props);
    }
    render() {
      return (
        <View style={StyleSheet.webConatiner}>
            <WebView
            ref={el => this.webView = el}
            style={{height: 20}}
            source={{html: '<div> </div>'}}
            onMessage={this.handleMessage}
            />
        </View>
      )
    }
    runJSInBackground (code) {
      this.webView.injectJavaScript(code)
    }
    handleMessage = (e) => {
      const message = e.nativeEvent.data
      console.log('message from webview:', message)
    }
}

export class PlayerOptions extends Component {
    constructor(props) {
        super(props);
    }
    updateIndex(index) {
        if (!this.props.playing) {
            this.props.action(index)
        }
    }

    render () {
        const buttons = ['Play', 'Compose', 'Define']
        return (
                <ButtonGroup
                    onPress={this.updateIndex.bind(this)}
                    selectedIndex={this.props.index}
                    buttons={buttons}
                    containerStyle={StyleSheet.optionsContainer}
                    buttonStyle={{backgroundColor: appColorLight}}
                    selectedButtonStyle={{backgroundColor: appColorClear}}
                />
        )
    }
}

export class ActionPicker extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={StyleSheet.controlContainer}>
                <View style={StyleSheet.labelContainer}>
                    <Text
                        style={[StyleSheet.labelText,{color: appColorLight}]}>
                        {this.props.label}
                    </Text>
                </View>
                <View style={[StyleSheet.textContainer, {backgroundColor: this.props.color}]}>
                    <TouchableOpacity 
                        onPress={() => this.props.enabled? this.props.load(this.props.items, this.props.value, this.props.action): null}
                        height={sectionHeight/5}> 
                        <Text style={[StyleSheet.valueText, this.props.enabled?{color: appColorDark}:{color: appColorDisabled}]}>
                            {this.props.value}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export class ActionButton extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <TouchableOpacity
                onPress={() => {this.props.enabled && this.props.action()}}
                style={StyleSheet.actionButtonContainer}> 
                <View style={StyleSheet.actionDisplay}>
                    <Text style={[StyleSheet.actionText, this.props.enabled?{color: appColorDark}:{color: appColorDisabled}]}>
                        {this.props.label}
                    </Text>
                </View>
                <View style={StyleSheet.actionIcon}>
                    <Icon
                        color = 'transparent'
                        reverse
                        reverseColor = {this.props.enabled?appColorDark:appColorDisabled}
                        name={this.props.icon}
                        type='font-awesome'
                        size={48}
                    /> 
                </View>
            </TouchableOpacity>
        )
    }
}

export class TextBox extends Component {
    constructor(props) {
        super(props);
        this.handleChange=this.handleChange.bind(this)
    }
    handleChange(name) {
        console.log(`change ${name}`)
        this.props.action(name)
    }
    render() {
        var val = this.props.value
        return (
            <View style={StyleSheet.controlContainer}>
                <View style={StyleSheet.labelContainer}>
                    <Text style={[StyleSheet.labelText, {color: appColorLight}]}>
                        {this.props.label}
                    </Text>
                </View>
                <View style={StyleSheet.textContainer}>
                    <TextInput
                        editable={this.props.enabled}
                        style={[StyleSheet.textBox, this.props.enabled?{color: appColorDark}:{color: appColorDisabled}]}
                        onSubmitEditing={(text) => this.handleChange(text)}
                        maxLength={10}
                        placeHolder={val}
                        placeholderTextColor={appColord}
                    />
                </View>
            </View>
        )
    }
}

export class BeatDisplay extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={StyleSheet.controlContainer}>
                <View style={StyleSheet.beatDisplay}>
                    <Text style={StyleSheet.beatText}>
                        Line {this.props.row+1}
                    </Text>
                </View>
                <View style={StyleSheet.beatDisplay}>
                    <Text style={StyleSheet.beatText}>
                        Beat {this.props.cell+1}
                    </Text>
                </View>
            </View>
        )
    }
}

export class PopupMenu extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={StyleSheet.menuContainer}>
                <TouchableOpacity 
                    onPress={() => { this.props.reset() }}> 
                    <Text style={StyleSheet.menuText}>
                        Reset...
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => { this.props.about() }}> 
                    <Text style={StyleSheet.menuText}>
                        About...
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

