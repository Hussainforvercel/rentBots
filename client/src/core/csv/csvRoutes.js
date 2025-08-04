import { json2csv } from 'json-2-csv';
import { getTransactions } from './getTransactionsData';
import {
	users,
	reservations,
	listings,
	securityDeposit,
	makeandModel
} from './adminData';

let allowedTransactionTypes = ['completed', 'future', 'grossEarnings'];

const csvRoutes = app => {

	app.get('/export-transaction', async (req, res) => {
		try {
			let type = req.query && req.query.type,
				hostId = req.user && req.user.id,
				toCurrency = req.query && req.query.toCurrency,
				listId = req.query && req.query.listId,
				payoutId = req.query && req.query.payoutId;

			if (!req.user || !req.user.id || req.user.admin || !allowedTransactionTypes.includes(type)) {
				res.redirect('/');
				return '';
			}

			let data = await getTransactions({ hostId, toCurrency, type, listId, payoutId });

			const csvData = json2csv(data);
			res.setHeader('Content-disposition', 'attachment; filename=' + type + '-transactions.csv');
			res.set('Content-Type', 'text/csv');
			res.send(csvData);
		} catch (error) {
			console.log(error)
		}
	})

	app.get('/export-admin-data', async (req, res) => {
		try {
			let type = req.query && req.query.type, search = req.query && req.query.search, filterType = req.query.filter;

			if (!req.user || !req.user.admin || !type) {
				res.redirect('/');
				return '';
			}

			let data = [];

			if (type === 'users') data = await users(search);
			else if (type === 'listings') data = await listings(search);
			else if (type === 'reservations') data = await reservations(search);
			else if (type === 'security-deposit') data = await securityDeposit(search, filterType);
			else if (type === 'make-model') data = await makeandModel();

			const csvData = json2csv(data);
			res.setHeader('Content-disposition', 'attachment; filename=' + type + '-data.csv');
			res.set('Content-Type', 'text/csv');
			res.send(csvData);
		} catch (error) {
			console.log(error)
		}
	})
};

export default csvRoutes;