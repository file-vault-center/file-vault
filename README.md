# Getting Started with File Vault

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `build docker image`

Run below commands

docker build -t file-vault-ui .
docker run -p 3000:3000 file-vault-ui
