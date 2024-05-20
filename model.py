from transformers import AutoModelForCausalLM, AutoProcessor
from PIL import Image
import torch

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = AutoModelForCausalLM.from_pretrained("./model/content/sample_data/save").to(device)
processor = AutoProcessor.from_pretrained("./model/content/sample_data/save")

def getAnswer(img, ques): 
    image = Image.open("." + img)
    pixel_values = processor(images=image, return_tensors="pt").pixel_values.to(device)
    question = ques
    input_ids = processor(text=question, add_special_tokens=False).input_ids
    input_ids = [processor.tokenizer.cls_token_id] + input_ids
    input_ids = torch.tensor(input_ids).unsqueeze(0).to(device)
    generated_ids = model.generate(pixel_values=pixel_values, input_ids=input_ids, max_length=50)
    # Decode the generated tokens
    generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
    
    # Optionally, remove the question part from the generated text
    # //lowercase ques
    ques = ques.lower()
    if ques in generated_text:
        answer = generated_text.split(ques, 1)[-1].strip()
    else:
        answer = generated_text.strip()

    return answer