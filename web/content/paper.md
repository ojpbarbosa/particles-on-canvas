## Introduction

Historically, arts and science have been viewed as two separate disciplines with different methods and goals. In recent years, however, there is an increasing recognition of the significant role that artistic methods can play in scientific research. Especially in the realm of data visualization, the transformation of complex scientific data into visual art is an emerging field. Data-driven art creation involves converting data sets into compelling digital visual art, which can improve communication and public engagement, stimulate innovation, and foster creativity in both fields. This interdisciplinary approach serves as a research outreach, offering a new lens through which to view scientific data by making it more accessible [4]. In that regard, we developed a methodology to create a _digital-artistic signature_ of an experiment, capturing the essence and complexity of the scientific data in a visually intuitive and engaging manner. This fusion of art and science not only enhances public engagement and communication but also fosters a creative exploration of the data. By translating particles' behaviors and characteristics, we unveiled a new dimension of understanding and appreciating scientific phenomena [3]. Through this project, we intend to blend the precision of science with the expressiveness of art, creating dynamic, intuitive, and abstract representations of scientific data that resonate with both experts and the general public.

## Our motivation

We are a team of eight passionate students driven by making a positive impact in our surroundings through STEAM. Therefore, going to CERN would offer us a once-in-a-lifetime opportunity to delve into the captivating world of particle physics and actively learn about physics in a fascinating and unique way alongside some of the most respected and accomplished scientists in the world, with a world-class environment and infrastructure. Moreover, securing our spot at CERN will promote the dissemination and advancement of youth science throughout Brazil and its academic institutions. At last, by emphasizing the ‘A’ in STEAM, we strongly believe that our experiment has the ability to awaken interest in particle physics among anyone in society, regardless of age, contributing to better dissemination and understanding of scientific knowledge.

## Methodology

### Experiment setup

Our goal is to create a visual and artistic signature for the line, and to do so we will take into account a variety of data from different sensors [2]. We will use the proton synchrotron to create different kinds of particles (protons, electrons, and antiparticles) withrticl different momentums. Then, we will send these particles in our line to collect different interactions with physical detectors. We will also determine, with measurements, what kind of particles went through the target, their speed, and their spatial distribution.

![Line setup systematic representation](/paper/line.jpg)

To gather all data related to the particle constitution, we will use a Cherenkov counter with a speed threshold defined so that only pions and kaons are counted and filtered by their mass. Then, we subtract these values from the scintillation counter to get the proton count. As for the second beam that emerges from the magnet containing the negative particles, we will use another Cherenkov counter and a scintillation counter in front of it, setting a threshold so that only the electrons, which are the lightest particles, are counted. This way, at the end, we will be able to identify the composition of the particles involved in the experiment [10].

In order to measure the velocity of such particles (in centimeters per picoseconds), two Multi Gap Resistive Plate Chambers (MRPC) sensors will be used. Since they can detect the passage time of particles, the speed is then obtained by the distance between the sensors divided by the time interval within two detections [7, 12].

Intending to get the spatial distribution, we propose assigning two DWCs 10cm x 10cm in the line. After their calibration ([see appendix A](#a-dwc-calibration)), they will be able to give us the position of the particles present, such values will allow us to get a sense of their behavior within the line numerically. The expected results can be verified bellow.

![DWC result](/paper/dwc-result.png)

## Data-driven art creation

With the acquired data, we are able to create a dataset representing how different particles behave in a given experiment combining their type, speed and spatial distribution. Then, we can assign different artistic characteristics to each of them in order to create visual representations of them.

We tested three sorts of algorithms in order to do so: neural network image generation, diffusion, and overlapping wave function collapse (WFC) [5], each one of them generating artistic images in their very own way. For the our purpose of generating art using particles, though, we came up with a methodology that combines particular elements of them: we developed a Proof of Concept (POC) model that uses the initial data corresponding to each particle to create regular data numerical and/or visual representations from its spatial distribution combined with a randomness factor - we call these _seeds_. Those seeds are then combined with the particle speed and type, each of them serving modifiers (e.g. speed might determine color temperature and type might determine color mode). If the seed is numerical, we use a convolutional neural network, which is widely use to analyze images, to generate a visual sample representation of the data. The modified visual seed then goes through a WFC algorithm ([see appendix B](#b-wave-function-collapse)), producing compelling signatures derived from the original particle data. The signatures from test data set can be [viewed in the gallery](/).

Currently, our POC outputs low resolution and non-consistent images. We may improve our model by using more advanced AI techniques and improving diffusion in order produce higher resolution images.

## What we hope to take from this experience

We are deeply committed to leveraging our time at CERN as a source of motivation for Brazil's youth, sparking their curiosity in the marvels of scientific exploration and inspiring them to consider careers in research and innovation, hence contributing to the constant evolution of physics. Our goal is to use this unique opportunity to enrich our community by disseminating our gained insights and experiences, highlighting the critical role of scientific progress in societal enhancement. Furthermore, by integrating the full potential of STEAM, including the arts, we aim to foster a comprehensive understanding of our environment and stimulate creative solutions to complex problems. We are immensely thankful for this opportunity to learn and to enhance interest in learning physics by incorporating visual arts, thereby broadening the current perspective of the beauty of physics.

## Acknowledgements

We are very grateful to our Chemistry teacher, who helped us throughout the project, Ana Paula de Lima Barbosa Ferreira, DSc, Guilherme Araujo Wood, MEng, our Particle Physics teacher, and Guilherme Macedo, PhD, our Data Science and AI teacher, who helped us design the data-driven art methodology. We would also like to thank Martin Schwinzerl, PhD, a member of the BL4S team at CERN, who was very friendly and helpful in solving our doubts, and professor Gustavo Gil da Silveira, PhD, researcher at CERN, who helped us with the experiment setup and the DWC calibration. Finally, we are extremely grateful to our school, the Technical High School of Campinas, for providing us with such a unique environment and opportunities to pursue our true passions.

## References

[1] Wikipedia contributors. Wave Function Collapse. _Wikipedia, The Free Encyclopedia_, 2024.

[2] Beamline for Schools. Beam and detectors. _Beamline for Schools Competition_, CERN, 2024.

[3] Beamline for Schools. Example experiments. _Beamline for Schools Competition_, CERN, page 6, 2024.

[4] N. Godinovic. Art and Physics. _European Physical Society Conference on High Energy Physics_, page 455, 2020.

[5] H. Joe. Wave Function Collapse. _Of Shaders and Triangles_, 2023.

[6] L. Liu. Delay wire chambers. _The University of Tokyo, AHCAL Tokyo Analysis Workshop_, page 4, 2018.

[7] Z. Liu, R. Beyer, J. Dreyer, X. Fan, R. Greifenhagen, D.W. Kim, R. Kotte, A. Laso Garcia, L. Naumann, K. R ̈omer, D. Stach, C. Uribe Estrada, M.C.S. Williams, and A. Zichichi. Novel low resistivity glass: MRPC detectors for ultra high rate applications. _Nuclear Instruments and Methods in Physics Research Section A: Accelerators, Spectrometers, Detectors and Associated Equipment_, 959:163483, 2020.

[8] A. Manarim and G. Vismara. The Delay Wire Chamber (DWC) Description. _CERN, LEP Division_, 1985.

[9] W. Nash and C. Grefe. Beam Profiling through Wire Chamber Tracking. _CERN_, 2013.

[10] Team Particular Perspective. Measuring The Particle Composition of the T9 Beamline. _Beamline for Schools Competition, CERN_, 2023.

[11] J. Spanggard. Delay Wire Chambers — A Users Guide. _CERN, SL Division_, page 5, 1998.

[12] Fuyue Wang, Dong Han, Yi Wang, Pengfei Lyu, and Yuanjing Li. A detailed study on the intrinsic time resolution of the future MRPC detector. _Nuclear Instruments and Methods in Physics Research Section A: Accelerators, Spectrometers, Detectors and Associated Equipment_, 950:162932, 2020.

## Appendix

### A DWC Calibration

In order to calibrate the Delay Wire Chambers, we foresaw three required calibration inputs. A test signal can be used to simulate a spill of particles at the same position. This test signal should have a triangular positive shape with a rise time of 10 ns, a flat top of 20 ns and a fall time of 60 ns. The amplitude should be 40 mV in 50 ohms and the repetition rate be around 10 kHz. The battery operating the DWC test generator switches on automatically when the trigger output is loaded with 50 ohms, this excitation results in six negative 80 mV output pulses from the chamber, four of which are from the cathodes and two from the anodes. Three series of data acquisitions can be noted, while exciting the chamber at: –30 mm; the center and at +30 mm, resulting in three reference points. The best linear fit through these three points along with a good coefficient of determination, results in the slopes and the offsets, which for a given setup are constant over time [11, 9, 8].

![DWC calibration principle](/paper/dwc-calibration.png)

### B Wave Function Collapse

Wave function collapse (WFC) is a procedural generation algorithm inspired by concepts from Quantum Mechanics, such as the Born rule about probability density for a particle position and the deterministic Schrödinger equation [1]. A wave function collapse occurs when an initial wave function, that is in superposition of a myriad of quantum states, reduces to a single quantum state due to interaction with the external world - which is called observation.

The WFC algorithm takes an input image or similar data and generates similar output based on solving constraints. It involves several key steps: getting an input and processing it into patterns (the input image is divided in smaller sections), initializing output, observing, and propagating [5]. The output is initialized as a "wave," where each cell contains potential patterns based on available options.

It then observes cells and collapses them into definite states, starting with cells of lowest entropy. The entropy formula used in wave function collapse is the Shannon Entropy, and refers to a measure of uncertainty or disorder in a system. In WFC, Shannon Entropy is utilized to determine the level of uncertainty in tile placement within a grid, guiding the algorithm towards solutions with lower uncertainty to create coherent generated patterns or structures.

After that process, changes propagate to neighboring cells, adjusting available pattern options based on constraints. Finally, the patterns are mapped to colors based on their positions in the output space.
