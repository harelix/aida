
const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime"); // CommonJS import

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


const MODEL_ID = "anthropic.claude-v2:1"
//const MODEL_ID = "anthropic.claude-instant-v1"

async function llm_generate(prompt, context) {

  const client = new BedrockRuntimeClient({region: "us-east-1"});

  let input = {
    "modelId": MODEL_ID,
    "contentType": "application/json",
    "accept": "*/*",
    "body": JSON.stringify({
      "prompt": `${context}\n\nHuman: ${prompt}\n\nAssistant:`,
      "max_tokens_to_sample": 300,
      "temperature": 0.5,
      "top_k": 250,
      "top_p": 1,
      "stop_sequences": [
        "\n\nHuman:"
      ],
    })
  }

  const command = new InvokeModelCommand(input);
  const response = await client.send(command);
  return response
}


router.post("/generate", async function(req, res, next) {

    console.log("generate called");
    //calculate time taken for the request to be processed
    let start = new Date();
    let end = null;

    let {action, text, context} = req.body;

    //prompt = PromptToAction[action](text)
    //adjust this to AIDA's constraints
    prompt = "";
    response = await llm_generate(prompt, context)

    end = new Date();
    console.log(`time taken: ${end - start}ms`);
    console.log("generate response received")

    const response_body = response.body;
    // Convert Uint8Array to Buffer
    let buffer = Buffer.from(response_body);
    // Convert Buffer to string
    let completion = buffer.toString();
    res.json({
      action,
      completion
    });

})

module.exports = router;
