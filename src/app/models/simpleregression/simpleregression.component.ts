import { Component, OnInit } from '@angular/core';

//Tensorflow.js
import * as tf from '@tensorflow/tfjs';

//Plotting related (Tensorflow.js)
import * as tfvis from '@tensorflow/tfjs-vis';


//Link for Google Sheet for loading the dataset
const csvUrl =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSOq_ldoc5XNUAKb3guOX09DwOL8QSWDvipMtlktESKIVXhAA1wdlt1NMzkI11-VSe7LlIa5F0eiWZH/pub?gid=1036250337&single=true&output=csv';



@Component({
  selector: 'app-simpleregression',
  templateUrl: './simpleregression.component.html',
  styleUrls: ['./simpleregression.component.scss']
})

export class SimpleregressionComponent implements OnInit {

  dataset: any;
  model = tf.sequential();


  ngOnInit(): void {

    this.loadData();
    this.visualizeDataset();
    this.linearregression();


  }

  async linearregression() {

    const numberEpochs = 100;

    // numOfFeatures is the number of column or features minus the label column
    const numOfFeatures = (await this.dataset.columnNames()).length - 1;


    const features: any = [];
    const target: any = [];

    const number_of_samples = 100;
    let counter = 0;

    await this.dataset.forEachAsync((e: any) => {

      if (Math.random() > 0.5 && counter < number_of_samples) {
        features.push(Object.values(e.xs));
        target.push(e.ys.Apparent_Temperature);
        counter++;
      }

    });

    console.log(features);

    //Creating the Tensors
    const features_tensor_raw = tf.tensor2d(features, [features.length, numOfFeatures]);
    const target_tensor = tf.tensor2d(target, [target.length, 1]);

    //Creating the model

    this.model.add(tf.layers.dense({ inputShape: [1], units: 1 }));
    //Training
    this.model.compile({ optimizer: 'sgd', loss: 'meanAbsoluteError' });


    const trainingplot: any = document.getElementById('training');

    await this.model.fit(features_tensor_raw, target_tensor, {
      // batchSize: 40,
      epochs: numberEpochs,
      validationSplit: 0.2,

      callbacks: [
        // Show on a tfjs-vis visor the loss and accuracy values at the end of each epoch.
        tfvis.show.fitCallbacks(trainingplot, ['loss', 'acc', "val_loss", "val_acc"], {
          callbacks: ['onEpochEnd'],
        }),
        {
          // Print to console the loss value at the end of each epoch.
          onEpochEnd: async (epoch: any, logs: any) => {
            // console.log(`${epoch}:${logs.loss}`);
            // console.log(logs);

            // this.accurracy = `${logs.val_acc * 100}%`;

          },
        },
        {
          onTrainEnd: async () => {
            this.visualizeDatasetTrained();
          },
        },
      ],
    });

  }

  async visualizeDatasetTrained() {

    const datasetplot: any = document.getElementById('modeltrained');

    const dataset: any = [];

    const number_of_samples = 10;
    let counter = 0;

    const predicted: any = [];

    await this.dataset.forEachAsync(async (e: any) => {
      // Extract the features from the dataset
      const features = { x: e.xs.Temperature, y: e.ys.Apparent_Temperature };

      if (Math.random() > 0.5 && counter < number_of_samples) {
        dataset.push(features);

        const aux = await (this.model.predict(tf.tensor1d([e.xs.Temperature])) as tf.Tensor).dataSync()[0];

        // console.log("Prediction", features.y);

        predicted.push({ x: e.xs.Temperature, y: aux });
        counter++;

      }

    });

    //plotting the scatter plot
    tfvis.render.scatterplot(
      datasetplot,
      {
        values: [dataset, predicted], series: ['Full dataset', 'predicted']
      },
      {
        width: 420,
        height: 300,
        xLabel: 'Temperature (C)',
        yLabel: 'Apparent Temperature  (C)',

      }
    );


  }

  async visualizeDataset() {

    const datasetplot: any = document.getElementById('datasetplotting');

    const dataset: any = [];

    const number_of_samples = 10;
    let counter = 0;

    await this.dataset.forEachAsync((e: any) => {
      // Extract the features from the dataset
      const features = { x: e.xs.Temperature, y: e.ys.Apparent_Temperature };

      if (Math.random() > 0.5 && counter < number_of_samples) {
        dataset.push(features);
        counter++;
      }

    });

    //plotting the scatter plot
    tfvis.render.scatterplot(
      datasetplot,
      {
        values: dataset, series: ['Full dataset']
      },
      {
        width: 420,
        height: 300,
        xLabel: 'Temperature (C)',
        yLabel: 'Apparent Temperature  (C)',

      }
    );


  }


  /**Load dataset from link */
  loadData() {
    // Our target variable (what we want to predict) is the column 'label' (wow, very original),
    // so we specify it in the configuration object as the label
    this.dataset = tf.data.csv(csvUrl, {
      columnConfigs: {
        Apparent_Temperature: {
          isLabel: true,
        },
      },
    });
  }

}
