const initialState = {
  step: 0,
  widgetCreation: {
    dataset: '',
    title: '',
    description: '',
    caption: ''
  }
};

export const SET_STEP = '@management/SET_STEP';
export const SET_WIDGET_CREATION_DATASET = '@management/SET_WIDGET_CREATION_DATASET';
export const SET_WIDGET_CREATION_TITLE = '@management/SET_WIDGET_CREATION_TITLE';
export const SET_WIDGET_CREATION_DESCRIPTION = '@management/SET_WIDGET_CREATION_DESCRIPTION';
export const SET_WIDGET_CREATION_CAPTION = '@management/SET_WIDGET_CREATION_CAPTION';

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

export function setWidgetCreationDescription(description) {
  return {
    type: SET_WIDGET_CREATION_DESCRIPTION,
    payload: description
  };
}

export function setWidgetCreationCaption(caption) {
  return {
    type: SET_WIDGET_CREATION_CAPTION,
    payload: caption
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
    case SET_WIDGET_CREATION_DESCRIPTION:
      return { ...state, widgetCreation: { ...state.widgetCreation, description: action.payload } };
    case SET_WIDGET_CREATION_CAPTION:
      return { ...state, widgetCreation: { ...state.widgetCreation, caption: action.payload } };
    default:
      return state;
  }
};
