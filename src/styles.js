'use strict';
import {Dimensions, StyleSheet} from 'react-native';
import {  hexToRgbA } from '../lib.js'
export const screenWidth=Math.abs(Dimensions.get('window').width)
export const screenHeight=Math.abs(Dimensions.get('window').height)

export const sectionHeight=(((screenHeight/3)*2)/10)*9
export const sectionWidth=screenWidth-20
export const contentWidth=screenWidth-50
export const menuWidth=screenWidth-100

export const appColorLight='#CCFFFF'
export const appColorSelected='#3399FF'
export const appColorDark='#000099'
export const appColorDisabled='grey'
export const appColorShadow='#330000'
export const appColorClear=hexToRgbA('#3399FF')
export const patternColors = [['#CCFFCC', '#666600'],['#FFE8E3', '#FF3300'],['#FFFFCC', '#FF6600']]

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    flexDirection: "column",
    alignItems: "center"
  },
  spinnerContainer: {
    flex: 1,
    alignItems: "stretch"
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 50
  },
  titleText: {
    padding: 10,
    color: "black",
    fontSize: 48,
    fontWeight: "bold",
    fontStyle: "italic"
  },
  horizontal: {
    flexDirection: "column",
    justifyContent: "space-around",
    paddingTop: screenHeight/3
  },
  bgImage: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
  },
  section: {
    flex: 1,
    height: (sectionHeight/3)*2,
    width: sectionWidth-20,
    backgroundColor: 'transparent',
    margin: 10,
  },
  topSection: {
    flex: 0,
    height: (screenHeight/20)*9,
    width: sectionWidth,
    alignItems: "stretch",
    justifyContent: "center",
    backgroundColor: 'transparent',
    borderColor: appColorClear,
    borderWidth: 6,
    borderRadius: 20,
    overflow: "hidden"
  },
  bottomSection: {
    flex: 0,
    height: (screenHeight/20)*9,
    width: sectionWidth,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: appColorClear,
    borderRadius: 20,
  },
  patternSection: {
    height: sectionHeight/2,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 10,
    backgroundColor: "transparent",
  },
  optionsContainer: {
    alignItems: "stretch",
    backgroundColor: "transparent",
    justifyContent: "center",
    borderColor: appColorSelected,
    borderWidth: 3,
  },
  dialContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dialButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  dialButton: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: appColorLight,
    borderRadius: 10,
    height: sectionHeight/10,
    width: sectionHeight/10,
    margin: 5
  },
  BPMSection: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'},
  BPMTextContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    width: (sectionWidth/2),
    marginTop: 36,
  },
  BPMContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    width: sectionWidth/6,
    height: sectionHeight/5,
  },
  dialArea: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  BPMText: {
    overflow: "visible",
    color: appColorLight,
    fontSize: 72,
    fontFamily: 'digital7',
  },
  sliderArea: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    width: sectionWidth-50,
    height: sectionHeight/10,
  },
  controlContainer: { flexDirection: "row", margin: 10, width: sectionWidth-30},
  labelContainer: {
    width: (contentWidth/10)*4,
  },
  labelText: {
    color: "gold",
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: "italic"
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:appColorLight,
    overflow: "hidden",
    borderColor: "black",
    borderRadius: 5,
    margin: 5
  },
  actionButtonContainer: {
    flexDirection: "row", 
    justifyContent: "space-around",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: appColorLight,
    overflow: "hidden",
    borderRadius: 12,
    margin: 5,
    height: (sectionHeight)/6,
    width: (contentWidth)
  },
  valueText: {
    fontWeight: "bold",
    fontSize: 24,
    fontStyle: "italic",
  },
  textBox: {
    fontWeight: "bold",
    fontSize: 24,
    fontStyle: "italic",
    color: appColorDark
  },
  beatCounter: {
    alignSelf: "stretch",
    alignItems: "center",
    flexDirection: "row"
  },
  patternProgress: {
    alignItems: 'flex-start',
    flexDirection: "column",
    justifyContent: "center",
    borderColor: "white",
    borderWidth: 2,
  },
  patternProgressRow: {
    alignItems: "stretch",
    flexDirection: "row",
    justifyContent: "center",
    overflow: 'hidden',
  },
  progressCaption: { alignSelf: "center", color: "gold", fontSize: 18 },
  progressText: {
    textAlign: "center",
    alignSelf: "stretch",
    margin: 5,
    width: 80,
    color: "red",
    backgroundColor: "black",
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "italic"
  },
  BPMIcon: { fontSize: 18 },
  overlay: {
    alignItems: "stretch",
    justifyContent: "flex-start",
    backgroundColor: appColorLight,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: appColorDark
  },
  overlaySelected: {
    alignSelf: "stretch",
    justifyContent: "center",
    backgroundColor: appColorDark,
  },
  overlaySelectedText: {
    color: appColorLight,
    fontSize: 24,
    fontWeight: "bold" },
  overlayScroll: { alignSelf: "stretch" },
  overlayItem: {
    alignSelf: "stretch",
    justifyContent: "center",
    backgroundColor: appColorLight,
  },
  overlayItemText: { color: appColorDark, fontSize: 24, fontWeight: "bold" },
  beatDisplay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: appColorSelected,
    borderRightColor: appColorShadow,
    borderRightWidth: 5,
    borderBottomColor: appColorShadow,
    borderBottomWidth: 5,
    borderLeftColor: appColorShadow,
    borderLeftWidth: 1,
    borderTopColor: appColorShadow,
    borderTopWidth: 1,
    borderRadius: 10,
    margin: 5
  },
  beatText: {
    fontWeight: "bold",
    fontSize: 24,
    color: appColorLight,
    fontStyle: "italic"
  },
  actionText: {
    fontSize: 28,
    fontWeight: "bold",
    fontStyle: "italic"
  },
  actionDisplay: {
    justifyContent: "center",
    alignItems: "center",
  },
  actionIcon: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: 'row'
  },
  applying: {
    alignItems: "stretch",
    justifyContent: "flex-start",
    backgroundColor: 'transparent',
    height: '100%',
    width: '100%'
  },
  WebViewStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: screenHeight/3,
    flex: 1,
    marginTop: 30,
  },
  menuContainer: {
    position: 'absolute',
    left: 20,
    top: 20,
    backgroundColor: appColorLight,
    margin: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: appColorDark
  },
  menuText: { color: appColorDark, fontSize: 24, fontWeight: "bold" },
  about: {
    alignItems: "stretch",
    justifyContent: "flex-start",
    backgroundColor: appColorLight,
    borderWidth: 1,
    borderColor: appColorDark,
    height: (screenHeight/10)*8
  },
  aboutText: { color: appColorDark, fontSize: 18 },
  pickListContainer: {flex:1, alignItems: 'stretch', justifyContent: 'flex-start'},
  headerBar: {height: 40, paddingTop: 0},
  webConatiner: { height: 0, overflow: "hidden"}
});