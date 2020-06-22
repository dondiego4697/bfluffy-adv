CREATE TABLE animal_category (
    id SERIAL NOT NULL,
    code TEXT NOT NULL,
    display_name TEXT NOT NULL,
    CONSTRAINT pk_animal_category PRIMARY KEY (id),
    CONSTRAINT uq_animal_category_code UNIQUE (code)
);

CREATE TABLE animal_breed (
    id SERIAL NOT NULL,
    code TEXT NOT NULL,
    display_name TEXT NOT NULL,
    animal_category_id INTEGER NOT NULL,
    CONSTRAINT pk_animal_breed PRIMARY KEY (id),
    CONSTRAINT uq_animal_breed_code UNIQUE (code),
    CONSTRAINT fk_animal_breed_animal_category_id_animal_category FOREIGN KEY(animal_category_id) REFERENCES animal_category (id)
);
