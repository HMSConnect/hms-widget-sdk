# Observation Blood Pressure Graph

If you are new user, please read [Getting started with HMS Widget](/embedded-widget?widget=get-started)


URL: `/embedded-widget/observation/blood-pressure-graph`

## Setup this widget to iframe
Replace `/embedded-widget/observation/blood-pressure-graph` url to your iframe project.

## Request HTTP GET
**Query Params**
| Key         | Type/Format | Default | Description                           |
| ----------- | ----------- | ------- | ------------------------------------- |
| patientId   | string      |         | `required` ID of patient              |
| encounterId | string      |         | `required` ID of encounter            |
| max         | string      | 20      | Number of total records in each fetch |

## Example

### Request
 - pathname: `/embedded-widget/observation/blood-pressure-graph?patientId=0debf275-d585-4897-a8eb-25726def1ed5&encounterId=3898f0f9-385e-478d-be25-5f05719e80af` 
