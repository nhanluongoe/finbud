const crudActions = ['create', 'c', 'update', 'u', 'delete', 'd'];
const filterActions = ['filter', 'f'];
const navigateActions = ['next', 'n', 'previous', 'p'];
const authActions = ['logout', 'lo'];
const otherActions = ['help', 'h'];

const validActions = [
  ...crudActions,
  ...filterActions,
  ...navigateActions,
  ...authActions,
  ...otherActions,
];
const validTargets = ['account', 'a', 'transaction', 't', 'budget', 'b'];

export function isCommandValid(command: string): boolean {
  const [action, target] = command.split(' ');

  if (otherActions.includes(action)) {
    return true;
  }

  return validActions.includes(action) && validTargets.includes(target);
}
