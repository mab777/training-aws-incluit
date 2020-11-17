const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const sqs = new AWS.SQS();

exports.handler = async (event) => {
    try {

        if (event.name !== typeof undefined && event.name !== null) {
            const expReg = new RegExp(/[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/g);
            const name = event.name;

            if (!expReg.test(name)) {
                // All messages on SQS *MUST* be a String
                await sqs.sendMessage({
                    MessageBody: JSON.stringify({
                        name: name
                    }),
                    QueueUrl: 'https://sqs.us-east-2.amazonaws.com/464975321668/test'
                }).promise();
            } else {
                console.log("ENTRE EN DE CHARS")
                return {
                    statusCode: 200,
                    body: "El parámetro name, no debe contener carácteres especiales"
                }
            }
        } else {
            return {
                statusCode: 406,
                body: "Es necesario que envie el parámetro"
            }
        }
    }
    catch (err) {
        console.log(err);

        return {
            statusCode: 500,
            body: JSON.stringify(err)
        };
    }

    return { statusCode: 200, body: "mensaje enviado" };
};
