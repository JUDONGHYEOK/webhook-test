const core = require("@actions/core");
const github = require("@actions/github");
const { IncomingWebhook } = require("@slack/webhook");

const USERS = [
  {
    slackID: "U06QSKJDCF7",
    githubID: "JUDONGHYEOK",
  },
  { slackID: "U06QSKJDCF7", githubID: "KoreanDonkey" },
];

try {
  const url = core.getInput("slack_url");
  const webhook = new IncomingWebhook(url);

  const send = async () => {
    webhook.send(
      {
        text: "PR이 도착했습니다.🫡",
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "PR이 도착했습니다.🫡",
              emoji: true,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `<@${
                USERS.find((user) => user.githubID === github.context.actor)
                  .slackID
              }>님이 MR을 보냈습니다!`,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `${github.context.payload.pull_request.requested_reviewers
                .map((reviewer) => {
                  const slackID = USERS.find(
                    (user) => user.githubID === reviewer.login,
                  )?.slackID;
                  return slackID ? `<@${slackID}>` : undefined;
                })
                .filter(Boolean)
                .join(" ")}님 리뷰해주세요!`,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `### PR 정보 \n - 제목: ${github.context.payload.pull_request.title} \n - URL: ${github.context.payload.pull_request.html_url}`,
            },
          },
          {
            type: "actions",
              elements: [{
                type: "button",
                url: `${github.context.payload.pull_request.html_url}`,
                text: "PR 확인하기",
              }],
          },

          // {
          //   color: '#36a64f',
          //   pretext: `<@${
          //     USERS.find((user) => user.githubID === github.context.actor)
          //       .slackID
          //   }>님이 MR을 보냈습니다!`,
          //   author_name: JSON.stringify(
          //     `${github.context.payload.pull_request.requested_reviewers
          //       .map((reviewer) => {
          //         const slackID = USERS.find(
          //           (user) => user.githubID === reviewer.login
          //         )?.slackID;
          //         return slackID ? `<@${slackID}>` : undefined;
          //       })
          //       .filter(Boolean)
          //       .join(' ')}님 리뷰해주세요!`
          //   ),
          // },
        ],
      },
      function (err, response) {
        console.log(response);
      },
    );
  };
  console.log(github.context.payload.pull_request);
  send();
} catch (error) {
  core.setFailed(error.message);
}
