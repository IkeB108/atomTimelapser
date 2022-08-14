'use babel';

import Timelapser from '../lib/timelapser';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('Timelapser', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('timelapser');
  });

  describe('when the timelapser:toggle event is triggered', () => {
    it('Activates or deactivates timelapser and important settings for it', () => {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.timelapser')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'timelapser:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        expect(workspaceElement.querySelector('.timelapser')).toExist();

        let timelapserElement = workspaceElement.querySelector('.timelapser');
        expect(timelapserElement).toExist();

        let timelapserPanel = atom.workspace.panelForItem(timelapserElement);
        expect(timelapserPanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'timelapser:toggle');
        expect(timelapserPanel.isVisible()).toBe(false);
      });
    });

    it('hides and shows the view', () => {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.timelapser')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'timelapser:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        // Now we can test for view visibility
        let timelapserElement = workspaceElement.querySelector('.timelapser');
        expect(timelapserElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'timelapser:toggle');
        expect(timelapserElement).not.toBeVisible();
      });
    });
  });
});
