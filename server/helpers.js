exports.mode = function() {
//COMMENT THESE IN FOR DEV MODE
  // var env = require('node-env-file');
  // env(__dirname + '/config/.env');      
};

exports.convertCategoryToString = function(categoryCode) {
  var categoryMap = {
    "A": 'Arts, Culture and Humanities',
    "B": 'Educational Institutions and Related Activities',
    "C": 'Environmental Quality, Protection and Beautification',
    "D": 'Animal-Related',
    "E": 'Health - General and Rehabilitative',
    "F": 'Mental Health, Crisis Intervention',
    "G": 'Diseases, Disorders, Medical Disciplines',
    "H": 'Medical Research',
    "I": 'Crime, Legal-Related',
    "J": 'Employment, Job-Related',
    "K": 'Food, Agriculture and Nutrition',
    "L": 'Housing, Shelter',
    "M": 'Public Safety, Disaster Preparedness and Relief',
    "N": 'Recreation, Sports, Leisure, Athletics',
    "O": 'Youth Development',
    "P": 'Human Services - Multipurpose and Other',
    "Q": 'International, Foreign Affairs and National Security',
    "R": 'Civil Rights, Social Action, Advocacy',
    "S": 'Community Improvement, Capacity Building',
    "T": 'Philanthropy, Voluntarism and Grantmaking Foundations',
    "U": 'Science and Technology Research Institutes, Services',
    "V": 'Social Science Research Institutes, Services',
    "W": 'Public, Society Benefit - Multipurpose and Other',
    "X": 'Religion-Related, Spiritual Development',
    "Y": 'Mutual/Membership Benefit Organizations, Other',
  };

  return categoryMap[categoryCode];
};

exports.convertStringToCategory = function(categoryString) {
  var categoryMap = {
    'Arts, Culture and Humanities': "A",
    'Educational Institutions and Related Activities': "B",
    'Environmental Quality, Protection and Beautification': "C",
    'Animal-Related': "D",
    'Health - General and Rehabilitative': "E",
    'Mental Health, Crisis Intervention': "F",
    'Diseases, Disorders, Medical Disciplines': "G",
    'Medical Research': "H",
    'Crime, Legal-Related': "I",
    'Employment, Job-Related': "J",
    'Food, Agriculture and Nutrition': "K",
    'Housing, Shelter': "L",
    'Public Safety, Disaster Preparedness and Relief': "M",
    'Recreation, Sports, Leisure, Athletics': "N",
    'Youth Development': "O",
    'Human Services - Multipurpose and Other': "P",
    'International, Foreign Affairs and National Security': "Q",
    'Civil Rights, Social Action, Advocacy': "R",
    'Community Improvement, Capacity Building': "S",
    'Philanthropy, Voluntarism and Grantmaking Foundations': "T",
    'Science and Technology Research Institutes, Services': "U",
    'Social Science Research Institutes, Services': "V",
    'Public, Society Benefit - Multipurpose and Other': "W",
    'Religion-Related, Spiritual Development': "X",
    'Mutual/Membership Benefit Organizations, Other': "Y"
  };

  return categoryMap[categoryString];
};