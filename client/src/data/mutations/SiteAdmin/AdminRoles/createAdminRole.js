import {
	GraphQLString as StringType,
	GraphQLInt as IntType,
	GraphQLNonNull as NonNull,
	GraphQLList as List
} from 'graphql';
import { AdminRoles, AdminPrivileges } from '../../../models';
import AdminRolesType from '../../../types/siteadmin/AdminRolesType';
import showErrorMessage from '../../../../helpers/showErrorMessage';

const createAdminRole = {
	type: AdminRolesType,
	args: {
		id: { type: IntType },
		name: { type: new NonNull(StringType) },
		description: { type: StringType },
		privileges: { type: new NonNull(new List(IntType)) }
	},
	async resolve({ request, response }, {
		id,
		name,
		description,
		privileges
	}) {
		try {
			let privilegesData = [];
			if (request?.user?.admin) {
				if (id) {
					const isExistAdminRole = await AdminRoles.findOne({
						attributes: ['id'],
						where: {
							id
						},
						raw: true
					});

					if (isExistAdminRole) {
						const updateRole = await AdminRoles.update({
							name,
							description
						}, {
							where: {
								id
							}
						}
						);

						if (updateRole) {
							if (privileges?.length > 0) {
								privilegesData = privileges.map((item) => { return { roleId: id, previlegeId: item }; });
								await AdminPrivileges.destroy({ where: { roleId: id } });
								await AdminPrivileges.bulkCreate(privilegesData);
							}

							return await {
								status: 200
							};
						} else {
							return await {
								status: 400,
								errorMessage: await showErrorMessage({ errorCode: 'commonError' })
							};
						}
					} else {
						return await {
							status: 404,
							errorMessage: await showErrorMessage({ errorCode: 'adminRoleError' })
						};
					}
				} else { // Create
					const createRole = await AdminRoles.create({
						name,
						description
					});

					if (createRole) {
						const createdId = createRole?.dataValues?.id;

						if (privileges?.length > 0) {
							privilegesData = privileges.map((item) => { return { roleId: createdId, previlegeId: item }; });
							await AdminPrivileges.bulkCreate(privilegesData);
						}

						return await {
							status: 200
						};
					} else {
						return await {
							status: 400,
							errorMessage: await showErrorMessage({ errorCode: 'commonError' })
						};
					}
				}
			} else {
				return {
					status: 500,
					errorMessage: await showErrorMessage({ errorCode: 'userLoginError' })
				}
			}
		} catch (error) {
			return {
				status: 400,
				errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
			};
		}
	}
}

export default createAdminRole;

/*

mutation ($id: Int, $name: String!, $description: String, $privileges: [Int]!) {
	createAdminRole (id: $id, name: $name, description: $description, privileges: $privileges) {
		status
		errorMessage
	}
}



*/