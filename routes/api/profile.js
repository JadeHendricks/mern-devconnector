const express = require('express');
const router = express.Router();
const request = require('request');
const dotenv = require('dotenv');
dotenv.config();
const { check, validationResult } = require('express-validator')
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const auth = require('../../middleware/auth');

// Get api/profile/me
// Fetch me profile
// Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error')
  }

});

// Get api/profile
// Get all profiles
// Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error')
  }

});

// Get api/profile/:id
// Get profile by user id
// Public
router.get('/user/:id', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.id }).populate('user', ['name', 'avatar']);
    if (!profile) {
     return res.status(400).json({ msg: 'Profile not found' })
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' })
    }
    res.status(500).send('Server Error');
  }
});

// DELETE api/profile
// Delete profile, user and posts
// Private
router.delete('/', auth, async (req, res) => {
  try {
    // Remove Profile, User
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User deleted' })
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error')
  }
});


// POST api/profile
// Create or update profile
// Private
router.post('/', [auth, [
  check('status', 'Status is required').not().isEmpty(),
  check('skills', 'Skills is required').not().isEmpty()
]], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()})
  }

  const { 
    company, website, location, bio, status, githubusername, 
    skills, youtube, facebook, twitter, instagram, linkedin } = req.body;

  const profileFields = {};    
  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (githubusername) profileFields.githubusername = githubusername;

  if (skills) {
    profileFields.skills = skills.split(',').map(skill => skill.trim());
  }

  // Build Social Object
  profileFields.social = {};

  if (youtube) profileFields.social.youtube = youtube;
  if (twitter) profileFields.social.twitter = twitter;
  if (facebook) profileFields.social.facebook = facebook;
  if (linkedin) profileFields.social.linkedin = linkedin;
  if (instagram) profileFields.social.instagram = instagram;

  try {
    // Using upsert option (creates new doc if no match is found):
    let profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error')
  }
});

// PUT api/profile/experience
// Add profile experience
// Private
router.put('/experience', [auth, [
  check('title', 'Title is required').not().isEmpty(),
  check('company', 'Company is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()})
  }

  const { title, company, location, from, to, current, description } = req.body;

  const newExp = { title, company, location, from, to, current, description };

  try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.experience.unshift(newExp);

    await profile.save();
    res.json(profile);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT api/profile/experience
// Add profile experience
// Private
router.put('/experience', [auth, [
  check('title', 'Title is required').not().isEmpty(),
  check('company', 'Company is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()})
  }

  const { title, company, location, from, to, current, description } = req.body;

  const newExp = { title, company, location, from, to, current, description };

  try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.experience.unshift(newExp);

    await profile.save();
    res.json(profile);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE api/profile/experience/:id
// Delete profile experience
// Private
router.delete('/experience/:id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //Get the remove index
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.id);
    profile.experience.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT api/profile/education
// Add education  to profile
// Private
router.put('/education', [auth, [
  check('school', 'School is required').not().isEmpty(),
  check('degree', 'Degree is required').not().isEmpty(),
  check('fieldofstudy', 'Field of study is required').not().isEmpty(),
  check('from', 'From is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()})
  }

  const { school, degree, fieldofstudy, from, to, current, description } = req.body;

  const newEdu = { school, degree, fieldofstudy, from, to, current, description };

  try {
    const profile = await Profile.findOne({ user: req.user.id });
    console.log(profile.educations);
    profile.educations.unshift(newEdu);

    await profile.save();
    res.json(profile);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// DELETE api/profile/education/:id
// Delete profile education
// Private
router.delete('/education/:id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //Get the remove index
    const removeIndex = profile.educations.map(item => item.id).indexOf(req.params.id);
    profile.educations.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET api/profile/github/:username
// Get user repos from github
// Public
router.get('/github/:username', async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc
            &client_id=${process.env.GITHUB_CLIENTID}&client_secret=${process.env.GITHUB_SECRET}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if(response.statusCode !== 200) {
        return res.status(400).json({ msg: 'No Github profile found' });
      }

      res.json(JSON.parse(body));
    });

    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;