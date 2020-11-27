import React from 'react';
import { observer } from 'mobx-react';
import { FirstProjectView } from '~/views/FirstProject';

export default observer(function IndexPage() {
  return <FirstProjectView />;
});
