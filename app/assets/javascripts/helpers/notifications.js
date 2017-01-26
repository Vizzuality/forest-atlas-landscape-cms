((function (App) {
  'use strict';

  App.Helper.Notifications = {

    site: {
      deletion: {
        type: 'warning',
        content: 'Are you sure you want to permanently delete this site and all of its pages?',
        additionalContent: 'The change is irreversible.',
        dialogButtons: true,
        closeable: false
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
      datasetRegistration: {
        type: 'warning',
        content: 'If you proceed to the dataset registration, the page\'s information you just entered will be lost.',
        dialogButtons: true,
        closeable: false
      },
      datasetPreview: {
        type: 'warning',
        content: 'The preview is loading. Please wait...',
        closeable: false
      },
      widgetError: {
        type: 'error',
        content: 'The widget\'s data couldn\'t be retrieved!',
        additionalContent: 'After a second try, if the error keeps on happening, please insert it later.'
      },
      imageUploadError: {
        type: 'error',
        content: 'The image couldn\'t be correctly uploaded!',
        additionalContent: 'If the issue keeps on happening, try to reduce its size.'
      }
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

    dashboard: {
      changed: {
        type: 'warning',
        content: 'The dashboard configuration has been updated and it might affect the visualizations.'
      },
      invalid: {
        type: 'error',
        content: 'The dashboard\'s state couldn\'t be restored!',
        additionalContent: 'This probably happens because its data changed.'
      },
      corrupted: {
        type: 'error',
        content: 'The URL you’ve been shared is corrupted!',
        additionalContent: 'As a consequence, we loaded the default dashboard.'
      },
      bookmarks: {
        deletion: {
          content: 'The bookmark has been successfully deleted!',
          autoCloseTimer: 5
        },
        corrupted: {
          type: 'error',
          content: 'The bookmarks have been corrupted and can\'t be retrieved!'
        },
        saveError: {
          type: 'error',
          content: 'The bookmark couldn\'t be saved properly!'
        },
        updateError: {
          type: 'error',
          content: 'The name of the bookmark couldn\'t be updated!'
        },
        deleteError: {
          type: 'error',
          content: 'The bookmark couldn\'t be deleted!'
        }
      }
    },

    dataset: {
      rowCount: {
        type: 'warning',
        content: 'The widget/dashboard won\'t use more than 10,000 rows.',
        additionalContent: 'Please make sure to filter the dataset to be below this limit.'
      },
      csv: {
        type: 'warning',
        content: 'Remote CSV files served over an encrypted network (HTTPS) are not supported yet!'
      }
    },

    widget: {
      deletion: {
        type: 'warning',
        content: 'Are you sure you want to permanently delete this widget?',
        additionalContent: 'This may break Open Content pages that are using it.',
        dialogButtons: true,
        closeable: false
      },
      loadingWarning: {
        type: 'warning',
        content: 'A chart on this page couldn\'t be loaded properly!'
      }
    }

  };
})(this.App));
