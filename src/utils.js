

export function getCookie(name){
	let jar, cookieVal, cookieKey;

	jar = document.cookie.split(';');

	for (var cookie of jar) {
		cookieKey = cookie.split('=')[0]
		cookieVal = cookie.split('=')[1]
		if (cookieKey === name){
			break;
		}
	}
	return cookieVal
}

export function setCookie(name, val){
	document.cookie = `${name}=${val}`
	return true
}

export function sortDataById(data, order) {
	const sortedData = [...data];
  
	sortedData.sort((a, b) => {
	  return (order === 'asc' ? 1 : -1) * (a.id - b.id);
	});
  
	return sortedData;
}
  
export function sortDataByStatus(data, order, status=['pending']) {
	const sortedData = [...data];

	sortedData.sort((a, b) => {
		const statusA = a.status.toLowerCase();
		const statusB = b.status.toLowerCase();

		if (status.includes(statusA) && !status.includes(statusB)) {
		return -1;
		} else if (!status.includes(statusA) && status.includes(statusB)) {
		return 1;
		} else {
		return (order === 'asc' ? 1 : -1) * statusA.localeCompare(statusB);
		}
	});

	return sortedData;
}


export function sortDataByDate(data, order) {
	const sortedData = [...data];

	sortedData.sort((a, b) => {
		const dateA = new Date(a.date);
		const dateB = new Date(b.date);

		return (order === 'asc' ? 1 : -1) * (dateA - dateB);
	});

	return sortedData;
}
  

export function sortDataByPaymentStatus(data, order) {
	const sortedData = [...data];
  
	sortedData.sort((a, b) => {
	  const paymentStatusA = a.paid;
	  const paymentStatusB = b.paid;
  
	  if (paymentStatusA === paymentStatusB) {
		return 0;
	  } else if (paymentStatusA && !paymentStatusB) {
		return order === 'asc' ? -1 : 1;
	  } else {
		return order === 'asc' ? 1 : -1;
	  }
	});
  
	return sortedData;
}
  

export function sortDataByAlphabetical(data, field, order) {
	const sortedData = [...data];

	sortedData.sort((a, b) => {
		const valueA = getValueByField(a, field).toLowerCase();
		const valueB = getValueByField(b, field).toLowerCase();

		return (order === 'asc' ? 1 : -1) * valueA.localeCompare(valueB);
	});

	return sortedData;
}


export function getValueByField(object, field) {
	const fields = field.split('.');

	let value = object;
	for (let i = 0; i < fields.length; i++) {
		if (!value || typeof value !== 'object') {
		return undefined;
		}
		value = value[fields[i]];
	}

	return value;
}


export function getChipColor(status){
	switch (status) {
		case 'pending':
			return 'warning';
		case 'on-route':
			return 'primary';
		case 'ready':
			return 'info';
		case 'confirmed':
			return 'info';
		case 'delivered':
			return 'success';
		case 'picked-up':
			return 'success';
		case 'paid':
			return 'success';
		case 'canceled':
			return 'error';
		case 'not-paid':
			return 'error';
		default:
			return 'warning';
	}
}


