import "./App.scss";
import React, { Suspense, useEffect, useRef, useState } from "react";
//components
import Header from "./components/header/Header";
import { Section } from "./components/section/Section";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Html, RoundedBox, useGLTF } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Yellow from "./components/objects/Yellow";
import Green from "./components/objects/Green";
import Grey from "./components/objects/Grey";

//page states
import state from "./components/state/State";

//intersection observer
import { useInView } from "react-intersection-observer";

import { motion } from "framer-motion-3d";

// const Model = () => {
//   // const gltf = new GLTFLoader();
//   // useGLTF("../public/yellow-chair/scene.gltf", true);
//   // gltf.load
//   // return <primitive object={gltf.scene} dispose={null} />;

//   const gltf = useLoader(GLTFLoader, "../public/yellow-chair/scene.gltf");
//   return ( /public/yellow-chair/scene.gltf
//     <>
//       <primitive object={gltf.scene} scale={0.4} />
//     </>
//   );
// };

//use fragments since using additional lights
const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[0, 10, 0]} intensity={1.5} />
      <spotLight intensity={1} position={[1000, 0, 0]} />
    </>
  );
};

const HTMLContent = ({
  bgColor,
  domContent,
  children,
  modelPath,
  positionY,
}) => {
  const ref = useRef();

  useFrame(() => (ref.current.rotation.y -= 0.005));
  const [refItem, inView] = useInView({ threshold: 0 });

  useEffect(() => {
    inView && (document.body.style.background = bgColor);
  }, [inView, bgColor]);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Section factor={1.5} offset={1}>
      <motion.group position={[0, positionY, 0]}>
        <motion.mesh
          initial={{ x: -200, scale: 1.0 }}
          animate={{ x: 0, scale: 1.2 }}
          transition={{ duration: 2 }}
          whileHover={{ scale: 0.1 }}
          whileTap={{ scale: 0.1 }}
          ref={ref}
          position={[0, -35, 0]}
        >
          {modelPath === "Yellow" && <Yellow />}
          {modelPath === "Green" && <Green />}
          {modelPath === "Grey" && <Grey />}
          {/* {(() => {
            if (modelPath === "Yellow") {
              return <Yellow />;
            } else if (modelPath === "Green") {
              return <Green />;
            } else {
              return <Grey />;
            }
          })()} */}
        </motion.mesh>
        <Html portal={domContent} fullscreen>
          <div className="container" ref={refItem}>
            {" "}
            {children}
          </div>
        </Html>
      </motion.group>
    </Section>
  );
};

function App() {
  const domContent = useRef();
  const scrollArea = useRef();
  const onScroll = (e) => (state.top.current = e.target.scrollTop);
  useEffect(() => void onScroll({ target: scrollArea.current }), []);
  return (
    <>
      <Header />
      <Canvas colorManagement camera={{ position: [0, 0, 120], fov: 70 }}>
        <Lights />
        <Suspense fallback={null}>
          <HTMLContent
            bgColor={"#f15946"}
            domContent={domContent}
            modelPath={"Yellow"}
            positionY={250}
          >
            <h1 className="title">Hello</h1>
          </HTMLContent>
          <HTMLContent
            bgColor={"#511ec1"}
            domContent={domContent}
            modelPath={"Green"}
            positionY={0}
          >
            <h1 className="title">Bye</h1>
          </HTMLContent>
          <HTMLContent
            bgColor={"#636567"}
            domContent={domContent}
            modelPath={"Grey"}
            positionY={-250}
          >
            <h1 className="title">Last.</h1>
          </HTMLContent>
        </Suspense>
        {/* <RoundedBox
          args={[1, 1, 1]}
          radius={0.05}
          smoothness={4}
          // {...meshProps}
        >
          <meshPhongMaterial attach="material" color="#f3f3f3" wireframe />
        </RoundedBox> */}
      </Canvas>
      <div className="scrollArea" ref={scrollArea} onScroll={onScroll}>
        <div style={{ position: "sticky", top: 0 }} ref={domContent}></div>
        <div style={{ height: `${state.sections * 100}vh` }}></div>
      </div>
    </>
  );
}

export default App;
