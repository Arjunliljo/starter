exports.getOverview = (req, res) => {
  console.log('working');
  res.status(200).render('overview', { title: 'All tours' });
};

exports.getTour = (req, res) => {
  res.status(200).render('tour', { title: 'Forrest Hiker' });
};
