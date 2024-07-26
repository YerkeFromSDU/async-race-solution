export const randomName = () => {
	const names = [
		'Mercedes',
		'Mazda',
		'Nissan',
		'Audi',
		'Porsche',
		'BMW',
		'Toyota',
		'Tesla',
		'Bentley',
		'Hyundai',
	];
	return names[Math.floor(Math.random() * names.length)];
};

export const randomModel = () => {
	const models = [
		'Mustang',
		'Camry',
		'X5',
		'A4',
		'E-Class',
		'911',
		'Altima',
		'Elantra',
		'MX-5',
		'Continental',
	];
	return models[Math.floor(Math.random() * models.length)];
};

export const randomColor = () => {
	const colors = [
		'#CAFC56',
		'#2F3C7E',
		'#990011',
		'#00246B',
		'#2C5F2D',
		'#97BC62',
		'#7A2048',
		'#A1BE95',
		'#735DA5',
	];
	return colors[Math.floor(Math.random() * colors.length)];
};
