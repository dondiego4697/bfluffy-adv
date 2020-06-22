CREATE TABLE region (
    id SERIAL NOT NULL,
    code SMALLINT NOT NULL,
    display_name TEXT NOT NULL,
    CONSTRAINT pk_region PRIMARY KEY (id),
    CONSTRAINT uq_region_code UNIQUE (code)
);

CREATE TABLE city (
    id SERIAL NOT NULL,
    code TEXT NOT NULL,
    display_name TEXT NOT NULL,
    region_id INTEGER NOT NULL,
    CONSTRAINT pk_city PRIMARY KEY (id),
    CONSTRAINT uq_city_code UNIQUE (region_id, code),
    CONSTRAINT fk_city_region_id_region FOREIGN KEY(region_id) REFERENCES region (id)
);
