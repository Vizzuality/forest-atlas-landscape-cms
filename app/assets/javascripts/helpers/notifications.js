((function (App) {
  

  App.Helper.Notifications = {

    site: {
      maxFileSize: {
        type: 'warning',
        content: 'Your file must weight less than 1MB!'
      },
      deselectContext: {
        type: 'warning',
        content: 'You can\'t unselect a context set as default!',
        additionalContent: 'Set another one as default before trying to unselect it.'
      },
      defaultLanguage: {
        type: 'error',
        content: 'The site is configured with a default language that is not available.',
        additionalContent: 'Please enable this language by ticking its checkbox.'
      }
    },

    page: {
      deletion: {
        type: 'warning',
        content: 'Are you sure you want to permanently delete this page and all of its child pages?',
        additionalContent: 'Alternatively, you can just hide it from the user by clicking the eye icon next to it.',
        dialogButtons: true,
        closeable: false
      },
    },

    structure: {
      update: {
        content: 'The structure has been successfully saved!',
        closeable: false,
        autoCloseTimer: 5
      },
      saving: {
        content: 'Saving the structure...',
        closeable: false
      },
      error: {
        content: 'The changes couldn\'t be saved!',
        type: 'error'
      },
      saveReminder: {
        content: 'Don\'t forget to save the changes before leaving the page!',
        type: 'warning'
      },
      visibilityReminder: {
        content: 'This page won\'t be visible to the users until all of its ancestors are enabled!',
        type: 'warning'
      }
    },

    profile: {
      deletion: {
        type: 'warning',
        content: 'Are you sure you want to permanently delete your account?',
        dialogButtons: true,
        closeable: false
      }
    }

  };
})(this.App));
