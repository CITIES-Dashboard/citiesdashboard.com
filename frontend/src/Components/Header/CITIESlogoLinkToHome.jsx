import { Link } from 'react-router-dom';
import citiesLogo from '../../cities-logo.png';

import * as Tracking from '../../Utils/Tracking';

function CITIESlogoLinkToHome() {
  return (
    <Link
      to="/"
      onClick={() => {
        Tracking.sendEventAnalytics(
          Tracking.Events.internalNavigation,
          {
            destination_id: '/',
            destination_label: 'home',
            origin_id: 'cities-logo'
          }
        );
      }}
    >
      <img
        style={{
          height: '100%', width: 'auto', borderRadius: '0.5rem'
        }}
        src={citiesLogo}
        title="Go to Homepage"
        alt="Go to Homepage"
      />
    </Link>
  );
}

export default CITIESlogoLinkToHome;
