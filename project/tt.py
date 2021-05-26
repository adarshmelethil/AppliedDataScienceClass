

def f(parameter_options_indexs, optionParameters, increment_multiple):
  for i in range(len(parameter_options_indexs)):
    parameter_options_indexs[i] += increment_multiple
    if parameter_options_indexs[i] >= len(optionParameters[i]["options"]):
      parameter_options_indexs[i] = 0
      continue
    return True
  return False

import random

a = [
  {"options": list(range(random.randint(0, 5)))} for i in range(5)
]
im = 3

b = [0 for _ in range(len(a)-3)]

while True:
  print(b)

  if not f(b, a, im):
    break