# GIZISIGHT BACKEND
## Run GiziSight Backend for debugging :
```
git clone https://github.com/GiziSight/backend
cd backend
npm install
npm run test
cd ..
git clone https://github.com/GiziSight/model-api
cp https://storage.googleapis.com/image-model-stunting/JsonFile/models.h5 .
pip install -r requirements.txt
uvicorn main:app --reload 
```
note :
- change the dbconnection.js to the database you've made.

## GiziSight on Cloud

### TOOLS NEEDED
1.  Cloud Environment: Google Cloud Platform (Cloud Run, Cloud Storage, Cloud SQL)
2.  Programming Language: Node js, Python
3.  Web Server: express and fast-api
4.  Server: Cloud Run

#### Create Cloud Storage
1.  Choose Cloud Storage on navigation menu
2.  Click  `Create Bucket`
3.  Name your bucket as you wish
4.  Location data : Region and choose  `asia-southeast2 (Jakarta)`
5.  Create the Bucket

#### Create Cloud SQL
1. open Cloud Shell
2. type ```gcloud sql instances create gizisight \
  --database-version=MYSQL_5_7 \
  --cpu=1 \
  --memory=1.7GiB \
  --storage-size=10GB \
  --storage-type=SSD \
  --region=us-central1```
  
#### Deploy Backend API at Cloud Run
1. Open Cloud Shell terminal
2. In terminal, type ```git clone https://github.com/GiziSight/backend```
3. add required json files into the backend folder
4. create artifact registry via console, name the artifact registry folder "backend", and location at asia-southeast2 (jakarta)
5. run ```gcloud builds submit -t asia-docker.pkg.dev/$PROJECT/backend/stunting-api:1.0.0```
6. run the command below
```
gcloud run deploy backend \ 
--image=asia-docker.pkg.dev/login-test-bc32d/backend/stunting-api@sha256:856dd00af803c80d1851625abe86abd6e6bf6943068cd3a3d9ca0ca666357160 \ 
--allow-unauthenticated \ 
--port=8080 \ 
--service-account=545085763979-compute@developer.gserviceaccount.com \ 
--timeout=1200 \ 
--cpu=1 \ 
--memory=2Gi \ 
--max-instances=2 \ 
--cpu-boost \ 
--region=asia-southeast2 \ 
--project=$PROJECT
```

#### Deploy model into API at Cloud Run
1. Open Cloud Shell terminal
2. In terminal, type ```git clone https://github.com/GiziSight/model-api```
3. add models.h5 into the model-api folder
4. create artifact registry via console, name the artifact registry folder "backend", and location at asia-southeast2 (jakarta)
5. run ```gcloud builds submit -t asia-docker.pkg.dev/$PROJECT/backend/model-api:1.0.0```
6. run the command below
```
gcloud run deploy model-api \ 
--image=asia-docker.pkg.dev/login-test-bc32d/backend/model-api@sha256:856dd00af803c80d1851625abe86abd6e6bf6943068cd3a3d9ca0ca666357160 \ 
--allow-unauthenticated \ 
--port=8080 \ 
--service-account=545085763979-compute@developer.gserviceaccount.com \ 
--timeout=1200 \ 
--cpu=4 \ 
--memory=16Gi \ 
--max-instances=4 \ 
--cpu-boost \ 
--region=asia-southeast2 \ 
--project=$PROJECT
```

## GiziSight Endpoint
1. /register
Method : POST
location: Body (RAW) JSON
Example:
```json
{
"username": "jonno",
"email": "jonnie@example.com",
"password": "password123",
"gender": "male",
"birthdate": "2003-11-09",
"height": 180,
"weight": 75
}
```
2. /login
Method: POST
location: Body (RAW) JSON
Example:
```json
{
"username": "jonno",
"email": "jonnie@example.com",
"password":"password123"
}
```
3. /getUser?
Method: GET
parameter : email
Example:
```
http://localhost:3000/getUser?email=jonnie@example.com
```
4. /api/search
Method: GET
parameter: query
Example:
```
http://localhost:3000/api/search?query=cara%20pencegahan%20stunting
```
5. /Upload
Method: POST
location: Body (form-data)
Key: image
type: File
