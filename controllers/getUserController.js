const jwt = require('jsonwebtoken');
const conn = require('../dbConnection').promise();
const moment = require('moment');
const AKGPerempuan = require('../dataAKGPerempuan.json');
const AKGLaki = require('../dataAKGLaki.json');

exports.getUser = async (req, res, next) => {
    try {
        // ... (kode autentikasi)

        const theToken = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(theToken, 'the-super-strong-secrect');

        const [row] = await conn.execute(
            "SELECT `id`,`username`,`email`,`gender`,`birthdate`,`height`,`weight` FROM `users` WHERE `id`=?",
            [decoded.id]
        );

        if (row.length > 0) {
            const userData = row[0];
            const birthdate = moment(userData.birthdate);
            const now = moment();
            const userAgeYears = now.diff(birthdate, 'years');
            const userAgeMonths = now.diff(birthdate, 'months');
            const userAgeWeeks = now.diff(birthdate, 'weeks');

            delete userData.birthdate;

            let userAge;
            if (userAgeYears > 0) {
                userAge = userAgeYears + ' tahun';
            } else if (userAgeMonths > 0) {
                userAge = userAgeMonths + ' bulan';
            } else {
                userAge = userAgeWeeks + ' minggu';
            }

            userData.age = userAge;

            const userGender = userData.gender.toLowerCase();

            let akgData = {};
            if (userGender === 'female') {
                akgData = AKGPerempuan.find(item => {
                    const ageRange = item.Usia.split(' - ');
                    const [minAgeStr, maxAgeStr] = ageRange;
                    const [minAge, maxAge] = [parseAge(minAgeStr), parseAge(maxAgeStr)];

                    return isUserAgeWithinRange(userAgeYears, userAgeMonths, userAgeWeeks, minAge, maxAge);
                });
            } else if (userGender === 'male') {
                akgData = AKGLaki.find(item => {
                    const ageRange = item.Usia.split(' - ');
                    const [minAgeStr, maxAgeStr] = ageRange;
                    const [minAge, maxAge] = [parseAge(minAgeStr), parseAge(maxAgeStr)];

                    return isUserAgeWithinRange(userAgeYears, userAgeMonths, userAgeWeeks, minAge, maxAge);
                });
            } else {
                return res.json({ message: "Data AKG tidak ditemukan untuk jenis kelamin ini" });
            }

            if (akgData) {
                const nutritionalComponents = Object.keys(akgData);
                const excludedItems = ["Gender", "Usia", "TB", "BB"];
                const groupSize = 12;
                
                // Filter out excluded items
                const filteredComponents = nutritionalComponents.filter(component => !excludedItems.includes(component));
                
                // Split the nutritional components into groups of 12
                const groupedComponents = [];
                for (let i = 0; i < filteredComponents.length; i += groupSize) {
                    const group = filteredComponents.slice(i, i + groupSize);
                    groupedComponents.push(group);
                }
                
                // Generate dictionaries for each group
                const dictionaries = groupedComponents.map((group, index) => {
                    const bagianKey = `bagian${index + 1}`;
                    return {
                        [bagianKey]: group.map(component => ({
                            "name": component,
                            "nilai": akgData[component]
                        }))
                    };
                });

                return res.json({ user: userData, akgData: dictionaries });
            } else {
                return res.json({ message: "Data AKG tidak ditemukan untuk rentang usia pengguna" });
            }
        } else {
            return res.json({ message: "Pengguna tidak ditemukan" });
        }
    } catch (err) {
        next(err);
    }
};

function parseAge(ageStr) {
    const [age, unit] = ageStr.split(' ');
    return { age: parseInt(age, 10), unit };
}

function isUserAgeWithinRange(userYears, userMonths, userWeeks, minAge, maxAge) {
    if (maxAge.unit === 'tahun') {
        return userYears >= minAge.age && userYears <= maxAge.age;
    } else if (maxAge.unit === 'bulan') {
        return userMonths >= minAge.age && userMonths <= maxAge.age;
    } else if (maxAge.unit === 'minggu') {
        return userWeeks >= minAge.age && userWeeks <= maxAge.age;
    }
    return false;
}
