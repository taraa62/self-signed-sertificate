#https://stackoverflow.com/questions/19665863/how-do-i-use-a-self-signed-certificate-for-a-https-node-js-server/24749608

#Первая команда создаёт корневой ключ
openssl genrsa -out rootCA.key 2048

#Вторая команда создаёт корневой сертификат.
#Common Name (eg, YOUR name) []: localhost
openssl req -x509 -new -key rootCA.key -days 10000 -out rootCA.crt
#Создаем сертификат подписаный нашим СА
#Генерируем ключ.
openssl genrsa -out localhost.key 2048

#Создаем запрос на сертификат.
#Тут важно указать имя сервера: домен или IP (например домен localhost)
#Common Name (eg, YOUR name) []: localhost
openssl req -new -key localhost.key -out localhost.csr

#подписать запрос на сертификат нашим корневым сертификатом.
openssl x509 -req -in localhost.csr -CA rootCA.crt -CAkey rootCA.key -CAcreateserial -out localhost.crt -days 5000




