![](https://i.imgur.com/evxrtfs.png)

# Interactive Crowd Voting Recognition

## Introduction

Voting by raising hands is a universal way of quickly collecting answers from a crowd. Nevertheless, regardless of its popularity, it is often an imprecise and fastidious method. 
Nowadays, we have the technological means to transform this simple voting system into a more engaging and efficient experience. I am going to demonstrate you some of the revolutionary possibilities based on artificial intelligence.

## Concept

**Interactive Crowd Voting Recognition** is a system that aims to provide a real time feedback of the vote of the crowd.
Basically, a question is asked, people raise their hand to vote and the result is displayed in real time on a screen.
Thanks to automatic people labeling, successive questions will lead to generation of statistics. 

*Example of application:*
*1) **first question**: "who is a woman?", **result**: 60% of hand raised
2) **second question**: "who is under 30 years old?", **result**: 30% of hand raised
3) **generated statistic**: "240 people in this room are women under 30 years old"*
    

## Milestones

One of the strengths of this concept is that it can be dissociated into lighter features.

Here is the list of features ranked by priority:
1) **One person detection**
    * Instant detection
    * Real time detection
    * Create an application to display the result
2) **Multiple people detection**
    * Instant detection
    * Real time detection
    * Display the number of people in the application
3) **Votes detection**
    * Instant raised hand detection
    * Real time raised hand detection
    * Display the number of votes in the application (bar chart)
    
*More features to come if I have enough time:*

4) **People labeling**
    * One person facial recognition
    * Multiple people facial recognition
5) **Assign votes to labels**
    * Assign one vote to a labeled person
    * Assign votes to labeled people
6) **Generate statistics**
    * create charts based on labeled people multiple answers
    * Display generated charts in the application

## Feasibility

Since a large amount of gesture detection documentation has been found, the 3 first milestones should be doable without too many difficulties. 
While the fourth milestone is also doable, the fifth and sixth milestones will probably represent a bigger challenge. This project is open source and in case that the last two milestones can't be realized on time, other contributors will be welcome to help finish it.

## Inspiration

![](https://i.imgur.com/si2o8dv.jpg =300x)
This idea has been inspired by the concept of [the wisdom of the crowd](https://en.wikipedia.org/wiki/Wisdom_of_the_crowd).
The wisdom of the crowd is the collective opinion of a group of individuals rather than that of a single expert.


## Helpful links

:::spoiler Links
https://github.com/Jeff-sjtu/CrowdPose
https://github.com/asankagp/UAV-GESTURE
https://posetrack.net/
http://densepose.org/
https://www.kaggle.com/auddin721/starter-crowd-counting-5924929a-a
https://paperswithcode.com/task/pose-estimation
https://paperswithcode.com/task/multi-person-pose-estimation
:::

## POC

**The goal** of the POC is **to verify** as fast as possible that the concept is feasable and **to highlight the difficulties** to be aware of the limites of the final project.

[Posenet](https://github.com/tensorflow/tfjs-models/tree/master/posenet) from Tensorflow is a model that detect pose in the Browser. This model is **simple** and **can easily be run** to test the Crowd Voting Recognition.


![](https://i.imgur.com/1p9qsJT.gif)


Posenet helped to test the following milestones:

|                              |Posenet |Posenet (modified) |
|:-----------------------------|:--------------:|:------------:|
|**One person detection**|✔| |
|**Multiple people detection**|✔| |
|**Votes detection**|✖|✔|
|**People labeling**|✖|✖|
|**Assign votes to labels**|✖|✖|
|**Generate statistics**|✖|✖|

## First Application (Vuejs)

Now it's time to create the first application to implement what has been verified by the POC following these steps:
1) Create a Vue application
2) Adapt the code of the POC to this Vue application
3) Display the result through a barchart


![](https://i.imgur.com/Tc1FR9D.png)




