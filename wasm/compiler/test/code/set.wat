# define SET_ELM_SIZE 4
# define SET_HEAD_SIZE 4

## Set memory struct
;; 0 - size
;; [1..size)

func set_create result
  seq_id_next() << 7 ;; Each set 128 bytes by default


func set_add(id n)
  local size i i_n

  size = set_size(id)
  i = set_search(id, n)
  if i == size
    set_insert_i(id, i, n)
  else
    i_n = set_get_i(id, i)
    if n != i_n
      set_insert_i(id, i, n)


func set_size(id) result
  [id]


func set_insert_i(id index n)
  local size offset offset_index

  size = set_size(id)
  if index == size
    [set_offset_i(id, index)] = n
    [id] = size + 1
  else
    offset_index = set_offset_i(id, index)
    offset = set_offset_i(id, size - 1)
    loop $loop
      [offset + SET_ELM_SIZE] = [offset]
      if offset != offset_index
        offset = offset - SET_ELM_SIZE
        br $loop
    [offset_index] = n
    [id] = size + 1


func set_delete_i(id index)
  local size curr to

  size = set_size(id)
  if size != 1
    curr = set_offset_i(id, index)
    to = set_offset_i(id, size - 1)

    if curr != to
      loop $loop
        [curr] = [curr + SET_ELM_SIZE]
        if curr + SET_ELM_SIZE != to
          curr = curr + SET_ELM_SIZE
          br $loop
  [id] = size - 1


func set_offset_i(id index) result
  id + SET_HEAD_SIZE + (index << 2)


func set_get_i(id index) result
  [set_offset_i(id, index)]


func set_search(id n) result
  local size offset a b
  local half half_index half_n res

  size = set_size(id)
  offset = 0
  if !size
    res = 0
  else
    loop $loop
      b = size >> 1 ;; size / 2
      a = size - b

      ;; left:a:(+1-0) | right:b
      half = offset + a
      half_index = half - 1
      half_n = set_get_i(id, half_index)
      if n > half_n
        if !b
          res = half
        else
          offset = offset + a
          br $loop
      else
        if n != half_n
          if size == 1
            res = half_index
          else
            size = a
            br $loop
        else res = half_index
  res


func set_has(id n) result
  local size i i_n res

  size = set_size(id)
  if !size
    res = 0
  else
    i = set_search(id, n)
    if i == size
      res = 0
    else
      i_n = set_get_i(id, i)
      if n == i_n
        res = 1
      else res = 0
  res


func set_delete(id n) result
  local size i i_n res

  size = set_size(id)
  if !size
    res = 0
  else
    i = set_search(id, n)
    if i == size
      res = 0
    else
      i_n = set_get_i(id, i)
      if n != i_n
        res = 0
      else
        set_delete_i(id, i)
        res = 1
  res

func set_free(id) result
  [id]

