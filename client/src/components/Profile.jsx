import React from 'react';
import AssetAddForm from './Asset_add_form';

const Profile = ({accounts, contract}) => {
	//console.log(accounts);

	return(
		<AssetAddForm contract={contract} accounts={accounts}/>
	)
}

export default Profile;