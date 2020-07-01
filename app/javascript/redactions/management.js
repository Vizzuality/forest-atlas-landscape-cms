const initialState = {
  step: 0,
  widgetCreation: {
    dataset: '',
    title: '',
    privateName: '',
    description: '',
    citation: '',
    allowDownload: true,
  }
};

export const SET_STEP = '@management/SET_STEP';
export const SET_WIDGET_CREATION_DATASET = '@management/SET_WIDGET_CREATION_DATASET';
export const SET_WIDGET_CREATION_TITLE = '@management/SET_WIDGET_CREATION_TITLE';
export const SET_WIDGET_CREATION_PRIVATE_NAME = '@management/SET_WIDGET_CREATION_PRIVATE_NAME';
export const SET_WIDGET_CREATION_DESCRIPTION = '@management/SET_WIDGET_CREATION_DESCRIPTION';
export const SET_WIDGET_CREATION_CITATION = '@management/SET_WIDGET_CREATION_CITATION';
export const SET_WIDGET_CREATION_ALLOW_DOWNLOAD = '@management/SET_WIDGET_CREATION_ALLOW_DOWNLOAD';

export function setStep(step) {
  return {
    type: SET_STEP,
    payload: step
  };
}

export function setWidgetCreationDataset(dataset) {
  return {
    type: SET_WIDGET_CREATION_DATASET,
    payload: dataset
  };
}

export function setWidgetCreationTitle(title) {
  return {
    type: SET_WIDGET_CREATION_TITLE,
    payload: title
  };
}

export function setWidgetCreationPrivateName(privateName) {
  return {
    type: SET_WIDGET_CREATION_PRIVATE_NAME,
    payload: privateName
  };
}

export function setWidgetCreationDescription(description) {
  return {
    type: SET_WIDGET_CREATION_DESCRIPTION,
    payload: description
  };
}

export function setWidgetCreationCitation(citation) {
  return {
    type: SET_WIDGET_CREATION_CITATION,
    payload: citation
  };
}

export function setWidgetCreationAllowDownload(allowDownload) {
  return {
    type: SET_WIDGET_CREATION_ALLOW_DOWNLOAD,
    payload: allowDownload
  };
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_STEP:
      return { ...state, step: action.payload };
    case SET_WIDGET_CREATION_DATASET:
      return { ...state, widgetCreation: { ...state.widgetCreation, dataset: action.payload } };
    case SET_WIDGET_CREATION_TITLE:
      return { ...state, widgetCreation: { ...state.widgetCreation, title: action.payload } };
    case SET_WIDGET_CREATION_PRIVATE_NAME:
      return { ...state, widgetCreation: { ...state.widgetCreation, privateName: action.payload } };
    case SET_WIDGET_CREATION_DESCRIPTION:
      return { ...state, widgetCreation: { ...state.widgetCreation, description: action.payload } };
    case SET_WIDGET_CREATION_CITATION:
      return { ...state, widgetCreation: { ...state.widgetCreation, citation: action.payload } };
    case SET_WIDGET_CREATION_ALLOW_DOWNLOAD:
      return { ...state, widgetCreation: { ...state.widgetCreation, allowDownload: action.payload } };
    default:
      return state;
  }
};
