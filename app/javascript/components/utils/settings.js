// Settings are returned as an indexed array from rails,
// so here we have some utils so we manipulate or grab items from there in 1 place
export default {
  find: (setting, settingsArray) => {
    return settingsArray && settingsArray.length ?
      settingsArray.find(s => s.name === setting) : [];
  },
  isset(setting) {
    return setting && 'value' in setting && setting.value.length > 0;
  },
  getValue(setting, settingsArray) {
    return this.find(setting, settingsArray).value;
  }
}

