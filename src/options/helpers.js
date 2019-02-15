const getGroupName = (groups, groupId) => {
  const group = groups.find(obj => obj.id === groupId);
  return group ? group.name : 'Default';
};

export const renderUI = () => {
  chrome.storage.local.get(['shortcuts', 'groups'], function(result) {

    const shortcuts = result.shortcuts || [];
    const groups = result.groups || [];

    // create group form
    const groupEl = document.getElementById('group-list');
    let groupStr = groups.map((group) =>
        `
        <option value=${group.id}>
          ${group.name} ${group.prefix ? `(${group.prefix})` : ''}
        </option>
      `);
    const groupHTML = groupStr.join(' ');
    groupEl.innerHTML = groupHTML;

    // groups table
    const groupsInfo = document.getElementById('groups-info');
    let groupsItems = groups.map((group) =>
      `
      <tr>
        <td>${group.name}</td>
        <td>${group.prefix}</td>
        <td></td>
      </tr>
    `);
    groupsInfo.innerHTML = groupsItems.join(' ');

    // shortcuts table
    const shortcutsInfo = document.getElementById('shortcuts-info');
    let shortcutsItems = shortcuts.map((shortcut) =>
      `
      <tr>
        <td>${getGroupName(groups, shortcut.group)}</td>
        <td>${shortcut.keyword}</td>
        <td>${shortcut.url}</td>
        <td>
          <img src="../../assets/icons/trash-alt-regular.svg" width="15" class="c-p" id="deleteShortcut" data-keyword="${shortcut.keyword}">
        </td>
      </tr>
    `);
    shortcutsInfo.innerHTML = shortcutsItems.join(' ');
  });
}

export const setDefaultValues = (cb) => {
  chrome.storage.local.get(['seedData'], function(result) {
    if (!result.seedData) {
      // adding default shortcuts
      chrome.storage.local.set({shortcuts: defaultShortcuts}, function() {
        cb();
      });

      chrome.storage.local.set({groups: defaultGroups}, function() {});

      chrome.storage.local.set({seedData: true}, function() {});
    } else {
      cb();
    }
  });
}

export const guid = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export const isValidURL = (string) => {
  var res = string.match(/(http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  if (res == null)
    return false;
  else
    return true;
};