var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ data: 'WEATHER' });
});

async function getCoordinates(city) {
  try {
    const token = process.env.MAPBOX_TOKEN
    const res = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${token}`)
    if (res.data.features.length !== 0) {
      return res.data.features[0]
    }
    return null
  } catch (err) {
    console.log(err)
    return null
  }
}


async function getWeather([lng, lat]) {
  try {
    const token = process.env.OPENWEATHER_TOKEN
    const res = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&appid=${token}&units=metric`)
    return res.data
  } catch (err) {
    console.log(err)
    return null
  }
}


router.get("/weather", async function (req, res) {
 try {
  const city = req.query;

  if (!city) {
    return res.status(400).json({ error: "city query is required" })
  }


  getCoordinates(city)
  const coordinates = await getCoordinates(city)
  if (!coordinates) {
    return res.status(400).json({ error: " cannot find any place with that name" })
  }

  const result = await getWeather(coordinates.geometry.coordinates)
  if (!result) {
    return res.status(400).json({ error: " cannot find any weather forecast at your place" })
  }
  console.log(result)
  res.json({ data: result })
} catch(err) {
  console.log(err)
  return res.send("ok")
}
})


module.exports = router;
