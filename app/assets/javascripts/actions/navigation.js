export const NAV_PUSH = 'NAV_PUSH';
export const NAV_POP = 'NAV_POP';

export function navigatePush(state) {
  return {
    type: NAV_PUSH,
    state
  };
}

export function navigatePop() {
  return {
    type: NAV_POP,
  };
}
