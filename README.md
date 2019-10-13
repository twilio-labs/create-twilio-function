# `create-twilio-function`

एक नया स्थापित करने के लिए एक कमांड लाइन उपकरण [Twilio Function](https://www.twilio.com/docs/api/runtime/functions) स्थानीय परीक्षण का उपयोग करके [`twilio-run`](https://github.com/twilio-labs/twilio-run).

[![Build Status](https://travis-ci.com/twilio-labs/create-twilio-function.svg?branch=master)](https://travis-ci.com/twilio-labs/create-twilio-function) [![Maintainability](https://api.codeclimate.com/v1/badges/e6f9eb67589927df5d72/maintainability)](https://codeclimate.com/github/twilio-labs/create-twilio-function/maintainability)

## प्रयोग

इस उपकरण का उपयोग करने के कई तरीके हैं। सबसे तेज और आसान `npm init` के साथ है:

```bash
npm init twilio-function function-name
cd function-name
npm start
```

यह "फंक्शन-नेम" नाम से एक नई डायरेक्टरी बनाएगा और इसमें उन सभी फाइलों को शामिल किया जाएगा जिन्हें स्थानीय स्तर पर ट्विलियो फंक्शन लिखने और चलाने की जरूरत है। Sएप्लिकेशन शुरू करने से स्थानीय होस्ट पर उदाहरण फ़ंक्शन की मेजबानी होगी: 3000 / उदाहरण।

### वैकल्पिक

आप `create-twilio-function` को चलाने के लिए` npm` का भी उपयोग कर सकते हैं।:

```bash
npx create-twilio-function function-name
```

या आप विश्व स्तर पर मॉड्यूल स्थापित कर सकते हैं:

```bash
npm install create-twilio-function -g
create-twilio-function function-name
```

## कमांड लाइन तर्क

```
create-twilio-function <name>

एक नया टिलिओ फंक्शन प्रोजेक्ट बनाता है

Commands:
  create-twilio-function <name>          Creates a new Twilio Function
                                         project                    [default]
  create-twilio-function list-templates  List the available templates you can
                                         create a project with.

Positionals:
  name  Name of your project.                                        [string]

Options:
  --account-sid, -a     The Account SID for your Twilio account      [string]
  --auth-token, -t      Your Twilio account Auth Token               [string]
  --skip-credentials    Don't ask for Twilio account credentials or import
                        them from the environment  [boolean] [default: false]
  --import-credentials  Import credentials from the environment variables
                        TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN
                                                   [boolean] [default: false]
  --template            Initialize your new project with a template from
                        github.com/twilio-labs/function-templates    [string]
  -h, --help            Show help                                   [boolean]
  -v, --version         Show version number                         [boolean]
  --path                                                     [default: (cwd)]
```

## योगदान

इस परियोजना में योगदान देने वाली किसी भी मदद का स्वागत किया जाता है।सुनिश्चित करें कि आप [आचार संहिता] (CODE_OF_CONDUCT.md) से पढ़ते हैं और सहमत होते हैं।

1. प्रोजैक्ट को Fork करें|
2. Fork को इस प्रकार Clone करें:

```bash
git clone git@github.com:YOUR_USERNAME/create-twilio-function.git
```

3. निर्भरता स्थापित करें

```bash
cd create-twilio-function
npm install
```

4. अपने बदलाव करें
5. अपने परिवर्तनों का परीक्षण इस प्रकार करें:

```bash
npm test
```

6. अपने परिवर्तन करें और एक पुल अनुरोध खोलें

## लाइसेंस

MIT
