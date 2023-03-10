import React, { useRef } from "react";
import axios from "axios";

const Form = (props) => {
  const promptRef = useRef();

  const stableDiffusionSend = async () => {
    const data = {
      prompt: promptRef.current.value,
      negative_prompt: "",
      width: "512", // "512",
      height: "512", //"512",
      samples: "1", //"1",
      num_inference_steps: "20", //"20",
      safety_checker: "no",
      enhance_prompt: "yes",
      seed: null,
      guidance_scale: 7.5,
      webhook: null,
      track_id: null,
    };

    // const data = {
    //   prompt: promptRef.current.value,
    //   // "ultra realistic close up portrait ((beautiful pale cyberpunk female with heavy black eyeliner)), blue eyes, shaved side haircut, hyper detail, cinematic lighting, magic neon, dark red city, Canon EOS R3, nikon, f/1.4, ISO 200, 1/160s, 8K, RAW, unedited, symmetrical balance, in-frame, 8K",
    //   negative_prompt: "",
    //   // "((out of frame)), ((extra fingers)), mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), (((tiling))), ((naked)), ((tile)), ((fleshpile)), ((ugly)), (((abstract))), blurry, ((bad anatomy)), ((bad proportions)), ((extra limbs)), cloned face, (((skinny))), glitchy, ((extra breasts)), ((double torso)), ((extra arms)), ((extra hands)), ((mangled fingers)), ((missing breasts)), (missing lips), ((ugly face)), ((fat)), ((extra legs)), anime",
    //   width: "", // "512",
    //   height: "", //"512",
    //   samples: "", //"1",
    //   num_inference_steps: "", //"20",
    //   safety_checker: "no",
    //   enhance_prompt: "yes",
    //   seed: null,
    //   guidance_scale: 7.5,
    //   webhook: null,
    //   track_id: null,
    // };

    const config = {
      method: "post",
      url: "http://localhost:8000/stablediffusion",
      // headers: { "Content-Type": "application/json" },
      data: data,
    };

    console.log(config);
    await axios(config)
      .then(function (response) {
        console.log(response);

        if (response.data.status === "success") {
          props.onDone({ isSuc: true, imgSrc: response.data.output[0] });
        } else if (response.data.status === "error") {
          const message = response.data.messege
            ? response.data.messege
            : response.data.message;
          if (typeof message === "string") {
            props.onDone({ isSuc: false, error: message });
          } else if (typeof message === "object") {
            let txt = "";
            Object.values(response.data.messege).map(
              (map) => (txt += map + "\n")
            );
            props.onDone({ isSuc: false, error: txt });
          }
        } else if (response.data.status === "processing") {
          props.onDone({ isSuc: false, error: "???????????????. ???????????????." });
        } else {
        }
      })
      .catch(function (error) {
        console.log(error);
        props.onDone({ isSuc: false, error: error });
      });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    stableDiffusionSend();
  };
  return (
    <>
      <form onSubmit={submitHandler}>
        <label htmlFor="prompt">????????? ??????</label>
        <input type="text" id="prompt" ref={promptRef} label="??????:" />
        <div>
          ??? : ultra realistic close up portrait ((beautiful pale cyberpunk
          female with heavy black eyeliner)), blue eyes, shaved side haircut,
          hyper detail, cinematic lighting, magic neon, dark red city, Canon EOS
          R3, nikon, f/1.4, ISO 200, 1/160s, 8K, RAW, unedited, symmetrical
          balance, in-frame, 8K
        </div>
        <button>??????</button>
      </form>
    </>
  );
};

export default Form;
