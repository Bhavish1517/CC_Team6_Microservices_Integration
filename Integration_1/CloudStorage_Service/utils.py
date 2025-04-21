# utils.py
import boto3
import os
from dotenv import load_dotenv
from botocore.exceptions import ClientError

load_dotenv()

AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION")
BUCKET_NAME = os.getenv("AWS_S3_BUCKET")

s3 = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=AWS_REGION,
    endpoint_url=f"https://s3.{AWS_REGION}.amazonaws.com"
)


def upload_file(file, path, user_folder):
    key = f"{user_folder}/{path}"
    try:
        s3.upload_fileobj(file, BUCKET_NAME, key)
        return {"status": "success", "filename": path}
    except ClientError as e:
        return {"status": "error", "message": str(e)}



def list_files(user_folder):
    try:
        response = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=user_folder)
        files = [obj["Key"].replace(f"{user_folder}/", "") for obj in response.get("Contents", [])]
        return files
    except ClientError as e:
        return {"status": "error", "message": str(e)}

def download_file(filename, user_folder):
    key = f"{user_folder}/{filename}"
    try:
        url = s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': BUCKET_NAME, 'Key': key},
            ExpiresIn=3600
        )
        return url
    except ClientError as e:
        return {"status": "error", "message": str(e)}

def delete_file(filename, user_folder):
    key = f"{user_folder}/{filename}"
    try:
        s3.delete_object(Bucket=BUCKET_NAME, Key=key)
        return {"status": "deleted", "filename": filename}
    except ClientError as e:
        return {"status": "error", "message": str(e)}

def get_storage_usage(user_folder):
    response = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=user_folder)
    total_bytes = sum(obj["Size"] for obj in response.get("Contents", []))
    return total_bytes