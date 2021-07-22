import React from 'react';

import UserSettings from '../user/User_Settings';

const RenderUserSettings = ({
  settingsOpen,
  openSettings
}) => { 
  if (settingsOpen) {
    return (
      <UserSettings
        mobile={true}
        settingsOpen={settingsOpen}
        openSettings={openSettings}
      />
    )
  } else {
    return (
      <div>
      </div>
    )
  }
}

export default RenderUserSettings;