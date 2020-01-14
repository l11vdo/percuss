# percuss

# A React Native drum loop / metronome app

![Percuss](/assets/images/drumicon.png)

## INTRODUCTION

My main reason for writing this app has been to consolidate my React Native skills by implementing and publishing a fairly challenging mobile app.

As a musician myself, I had played around with metronomes and other music focused apps, but hadn't found anything like this.

My requirement was to be able easily generate a simple percussion backing track with the tempo amd vibe I wanted.

### WHAT DOES IT DO?

Percuss is fundamentally a straightforward metronome app (for non-musicians it basically marks time).

The difference between this and other metronome apps is that instead of playing a single beat the user can define a whole drum loop to play instead.

As far as I am able to ascertain, there is no other app in the app store offering this level of functionality - whether there needed to be I leave you to decide :grin:

The app is at its most effective by the way when the phone is connected to a speaker!

### USAGE

#### MAIN CONTROLS
![usage](/assets/images/usage1.png)

#### PLAY TAB
![PLAY](/assets/images/playtab.png)

Mode:

    Loop - play the pattern over and over again
    One Time - play the pattern once

Pattern:

    Pick the pattern you wish to play

Play / Pause button

#### COMPOSE TAB
![COMPOSE](/assets/images/composetab.png)

Used in combination with the Pattern Designer - select the position where you want a beat to play in the Pattern designer then select the sound

'Play Beat' button plays the selected beat once

#### DEFINE TAB
![DEFINE](/assets/images/definetab.png)

Here you can change the drum kit, and number of beats for the currently loaded pattern (disabled for the samples we supply)

You can also create a new drum pattern here

### LESSONS LEARNT

I elected to use the Expo platform to write and deploy the app. As far as I can tell, this does not look like a terrible decision and I should hopefully reap the rewards on deploying the IOS version as they claim it is platform independent (we shall see)!

One drawback however was the performance of the Expo app on my phone - I didn't realise that this would impact a timings sensitve app like this and I ended up spendng a lot more time on performance optimisation than was necessary.

There is no 'native' code - the whole app is written in React Native. The biggest issue I found with this was the 'single threadedness' of React Native - and in test mode I was often finding the whole UI just locking up. In the end I've had to accept thatcontrols only respond while playing at the end of the pattern.

### WHAT'S NEXT?

Extensions and features to come:
1. Extend the drumsets to include more beats
1. Add new drumsets
1. Improve UI while playing to show which beat(s) are playing and where we are in the loop. NB this may be problematic as spinning through a life cycle in the middle of a pattern can affect the timing!
1. Implement 'themes' for the user to switch the colors
1. Test and release on IOS
1. Implement fills, intros, outros...

### CONCLUSION

The app is really just a proof of concept as of now (hence there are no ads and no publicity etc)

Nonetheless it's been a great learning curve and I feel ready now to take on further projects 
