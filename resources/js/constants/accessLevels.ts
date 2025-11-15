const ACCESS_LEVELS = [
  {name: 'owner', color: 'gold'},
  {name: 'editor', color: 'blue'},
  {name: 'viewer', color: 'default'},
]

function getAccessLevelColor(level: string | undefined = 'viewer') {
  const accessLevel = ACCESS_LEVELS.find(item => item.name === level);
  return accessLevel ? accessLevel.color : 'default';
}

export { ACCESS_LEVELS as default, getAccessLevelColor };
export type accessLevelsType = typeof ACCESS_LEVELS[number]['name'];
