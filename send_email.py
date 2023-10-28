from trycourier import Courier

API_KEY = "pk_prod_B3EN4FX40P4EJ5HNNCPVNB3C6RMT"

client = Courier(auth_token=API_KEY)

resp = client.send_message(
	message = {
		"to": {
			"email": "nofoert@gmail.com",
		},
		"content": {
			"elements": [
				{
					"content": "Welcome, ",
					"type": "string"
				},
				{
					"content": "{{username}}",
					"type": "string"
				},
				{
					"content": "!",
					"type": "string"
				}
			]
		},
		"data": {
			"name": "Peter Parker",
		},
		"routing": {
		"method": "single",
		"channels": ["email"],
		},
	}
)

print(resp['requestId'])
print(resp)

