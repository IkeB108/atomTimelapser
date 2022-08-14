'use babel';

import TimelapserView from './timelapser-view';
import { CompositeDisposable } from 'atom';

export default {

  timelapserView: null,
  modalPanel: null,
  subscriptions: null,

  config: {
    "redoSpeed": {
      type: "integer",
      default: 30,
      minimum: 1
    }
  },

  activate(state) {
    this.timelapserView = new TimelapserView(state.timelapserViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.timelapserView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'timelapser:toggle': () => this.toggle(),
      'timelapser:undoAll': () => this.undoAll(),
      'timelapser:redoAll': () => this.redoAll(),
      'timelapser:startRedoing': () => this.startRedoing(),
      'timelapser:stopRedoing': () => this.stopRedoing()
    }));
    
    this.isActive = false;
    this.activatedOnce = false;
    this.userWantsActive = false;
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.timelapserView.destroy();
  },

  serialize() {
    return {
      timelapserViewState: this.timelapserView.serialize()
    };
  },

  toggle() {
    this.isActive = !this.isActive
    this.userWantsActive = !this.userWantsActive
    let thisCopy = this;
    
    let deactivate = function(){
      console.log("Deactivated!")
      
      atom.config.set("editor.undoGroupingInterval", this.usersPreviousInterval)
      let editor = atom.workspace.getActiveTextEditor();
      editor.getBuffer().history.maxUndoEntries = this.usersPreviousUndoStackSize;
      thisCopy.isActive = false;
    }
    
    let activate = function(){
      console.log("Activated!")
      
      thisCopy.activatedOnce = true;
      
      let editor = atom.workspace.getActiveTextEditor();
      thisCopy.usersPreviousInterval = atom.config.get("editor.undoGroupingInterval");
      atom.config.set("editor.undoGroupingInterval", 0);
      thisCopy.usersPreviousUndoStackSize = editor.getBuffer().history.maxUndoEntries;

      editor.onDidChange( ()=>{
        let editor = atom.workspace.getActiveTextEditor();
        editor.getBuffer().history.maxUndoEntries ++ 
        editor.getBuffer().maxUndoEntries ++
      } )
      thisCopy.isActive = true;
    }
    
    if(this.userWantsActive){
      
      
      
      //Set up the timelapser
      let editor = atom.workspace.getActiveTextEditor();
      
      if(!this.activatedOnce){
        atom.workspace.onDidChangeActiveTextEditor( ()=>{
          let editor = atom.workspace.getActiveTextEditor();
          if(typeof editor !== "undefined"){
            deactivate();
            if(this.userWantsActive)activate();
          }
        } )
      }
      atom.confirm( {
        message: "Timelapser is now active.",
        buttons: ["OK"]
      } )
      activate();
    }
    
    if(!this.userWantsActive){
      //Return settings to the user's preferences
      atom.confirm( {
        message: "Timelapser is deactived.",
        buttons: ["OK"]
      } )
      deactivate();
    }
  },
  
  undoAll() {
    console.log("Undo All")
    let editor = atom.workspace.getActiveTextEditor();
    let undoStackLength = editor.getBuffer().history.undoStack.length
    for(let i = 0; i < undoStackLength; i ++) editor.undo();
  },
  
  redoAll() {
    console.log("Redo All")
    let editor = atom.workspace.getActiveTextEditor();
    let redoStackLength = editor.getBuffer().history.redoStack.length
    for(let i = 0; i < redoStackLength; i ++) editor.redo();
  },
  
  startRedoing () {
    console.log("Start Redoing")
    let redoSpeed = atom.config.get("timelapser.redoSpeed")
    timelapseRedoInterval = setInterval( ()=>{
      let editor = atom.workspace.getActiveTextEditor();
      editor.redo();
      let newScreenPosition = editor.getCursorScreenPosition();
      let r = newScreenPosition.row;
      newScreenPosition.row = Math.round( (r/10) ) * 10
      editor.scrollToScreenPosition( newScreenPosition, {center:true} );
      if( editor.getBuffer().history.redoStack.length == 0 ){
        this.stopRedoing();
      }
    }, redoSpeed )
  },
  
  stopRedoing () {
    console.log("Stop Redoing")
    if(typeof timelapseRedoInterval !== undefined)
    clearInterval(timelapseRedoInterval);
  }

};
