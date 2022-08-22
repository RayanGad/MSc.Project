# This file is for the Flask API deployment
################################################################################

#Import dependencies
# Flask utils
from flask import Flask, jsonify, request
from werkzeug.utils import secure_filename

# Keras
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import torchvision.transforms as transforms

import os
import numpy as np
import pandas as pd
import glob

# Define flask app
app=Flask(__name__)

#Set model path
MODEL_PATH = 'models/model.h5'
BASEPATH = os.path.dirname(__file__)

#Set required image size
IMAGE_SIZE = 50

#Load trained model : Model obtained from (https://www.kaggle.com/code/vbookshelf/part-1-breast-cancer-analyzer-web-app/notebook)
model = load_model(MODEL_PATH)
model.make_predict_function()

# Pre-process function
def image_preprocess(filenames):
    # Use Keras ImageDataGenerator and flow_from_directory functionality
    # These steps perfrom rescale size 50, convert to float and normalise from RGB 0-255 to range 0-1

    img_dir = os.path.join(BASEPATH, 'uploads')
    datagen = ImageDataGenerator(rescale=1.0/255)    #scale images from integers 0-255 to floats 0-1.
    generator = datagen.flow_from_directory(img_dir,target_size=(IMAGE_SIZE,IMAGE_SIZE),batch_size=1, class_mode='categorical',shuffle=False)
    generator.reset() # Reset generator needed
    return generator

# Predict function
def model_predict(model, filenames):

    #Pre-process the image from original model code
    test_gen =image_preprocess(filenames)

    # Get filename and class indices
    predict_filenames = test_gen.filenames
    test_gen.class_indices

    # Make predictions (predict returns a tensor)
    preds = model.predict_generator(test_gen, steps=int(len(predict_filenames) / 1)+1, verbose=1) # shape [1,2]            ('no_idc','has_idc')

    #Create dataframe for predicted results
    df_preds = pd.DataFrame(preds, columns=['no_idc', 'has_idc'])
    positive_propability = df_preds._get_value(0, 'has_idc')
    negative_propability=df_preds._get_value(0, 'no_idc')
    
    return positive_propability, negative_propability


# Custom API ( For hosting API)
@app.route('/predict', methods=['POST'])
def predict():
       
    #get the file from the post request
    imagefile = request.files['image']

    #Check if post request has a file
    if 'image' not in request.files:
        
        resp = jsonify({'message':'No file in the request'})
        resp.status_code = 404  #Check status (code when "no data available")
        return resp

    # Empty the test image folder before new upload    
    img_files = request.files.getlist('image')
    test_files = os.path.join(BASEPATH, 'uploads', 'testing','*')
    files = glob.glob(test_files)
    for f in files:
        os.remove(f)

    #Upload Images to upload/testing directory
    for file in img_files:
        file_name= secure_filename(file.filename)
        image_path = os.path.join(BASEPATH, 'uploads','testing', file_name)
        imagefile.save(image_path)

    # Call predictions function, return probabilities of positive and negative cases
    pos_preds, neg_preds = model_predict(model, file_name)

    # Return Positive and negative probabilities of having IDC
    return jsonify({"IDC positive": str(pos_preds), "Normal": str(neg_preds)})

if __name__ == '__main__':
    app.run(port=3002, debug=True)

# Additional Notes#   
# To Run: 
# 1. Activate virtual environment: source ENV/bin/activate
# 2. Run Flask (Compile and start server): python apiApp.py
