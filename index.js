#!/usr/bin/env node

const { IncomingWebhook } = require('@slack/client');
const url = process.env.SLACK_WEBHOOK_URL;

// exit early
if (!url) {
  console.error('Error:', 'Have you defined a SLACK_WEBHOOK_URL environment variable?');
  process.exit(1);
}

const inputArray = process.argv.splice(2);
const params = {};

if (inputArray.length) {
  for (let i = 0; i < inputArray.length; i++) {
    if (inputArray[i].startsWith('-t')) {
      if (!inputArray[i + 1].startsWith('-')) {
        params.text = inputArray[i + 1];
        i++;
      } else {
        params.text = 'Doing doing doing...';
      }
    }

    if (inputArray[i].startsWith('-c')) {
      if (!inputArray[i + 1].startsWith('-')) {
        params.colour = inputArray[i + 1];
        i++;
      } else {
        params.colour = '';
      }
    }
  }
}

const webhook = new IncomingWebhook(url);

const SLACK_USERNAME = 'GitLab';
const SLACK_ICON_URL = 'https://avatars.slack-edge.com/2018-04-13/346726810930_b948c92d49c661d4cf6c_48.png';

const PRETEXT = process.env.CI_PROJECT_NAME && `Update: *${process.env.CI_PROJECT_NAME}* project`;
const MESSAGE = params.text;

// 'Link to CI/CD Task/Project'
const JOB_NAME = `${process.env.CI_JOB_NAME} (${process.env.CI_JOB_ID})`;
const JOB_URL = process.env.CI_JOB_URL || process.env.CI_PROJECT_URL;

const payload = {
  username: SLACK_USERNAME,
  icon_url: SLACK_ICON_URL,
  // "color": "#36a64f",
  // "color": "good",
  // "color": "warning",
  // "color": "danger",
  // "color": "#439FE0",

  attachments: [{
    color: params.colour,
    text: MESSAGE,
    pretext: PRETEXT,
    title: JOB_NAME,
    title_link: JOB_URL
  }]
};

// Send simple text to the webhook channel
webhook.send(payload, function (err, res) {
  if (err) {
    console.error('Error:', err);
    process.exit(1);
  } else {
    console.info('Slack message sent:', res.text);
  }
});
