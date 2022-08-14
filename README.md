# timelapser package
For recording timelapses of the history of your file (only stores changes made since the file was opened).

##How to use
- **BEFORE you start coding...** Press Alt+T to activate the timelapser. This temporarily changes a few of Atom's settings (Press Alt+Ctrl+T again to stop and revert the settings)
- When you're done, make a backup of your file. Then press Alt+Ctrl+Z to undo as many times as possible
  - This takes you to the beginning of the life of your file assuming you started the timelapser with an empty file
  - **Warning: Do not make any changes to your file during this time as it will erase the entire undo history and you will lose your file. Making backups is strongly recommended**
- Press Alt+Ctrl+1 to start redoing (redo speed is configurable in settings)
- Press Alt+Ctrl+2 to manually stop redoing (automatically stops when you reach the end)
- Press Alt+Ctrl+Y to redo as many times as possible if needed
- Optional recommendation: pair this package with the scroll-through-time Atom package for convenience (certainly not necesssary)

##How does it work?
Timelapser changes Atom's Undo Grouping Interval setting (sets it to 0) so that every single keystroke is counted separately in the Undo Stack.

It also makes your maximum undo stack size "infinite" -- since Atom doesn't allow an infinite undo stack size, it just increments the value by 1 every time you make a change to the document.

**Be aware that this could theoretically cause performance issues with files that have a very long undo history. This package does not do anything to prevent crashing or protect your files.**

![Icon for the package](https://f.cloud.github.com/assets/69169/2290250/c35d867a-a017-11e3-86be-cd7c5bf3ff9b.gif)
