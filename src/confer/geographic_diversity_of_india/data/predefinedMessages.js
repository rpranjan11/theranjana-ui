import india_img from '../images/india_img.png';
import diversity_img from '../images/diversity_img.png';
import himalaya_ranges_img from '../images/himalaya_ranges_img.png';
import thar_desert_img from '../images/thar_img.png';
import plains_img from '../images/plains_img.png';
import plateaus_img from '../images/plateaus_img.png';
import coasts_img from '../images/coasts_img.png';
import islands_img from '../images/islands_img.png';
import climate_img from '../images/climate_img.png';

const predefinedMessages = [
    { type: 'text', content: 'Today\'s topic is as follows:     <=>     오늘의 주제는 다음과 같습니다:' },
    { type: 'text', content: 'Geographic Diversity of India    <=>     인도의 지리적 다양성' },
    { type: "image", content: india_img},
    { type: 'text', content: 'India\'s diverse geography has profoundly influenced the unique cultures, traditions, and languages of its regions. Recognized as one of the world\'s 17 megadiverse countries, India is home to over 47,000 plant species and 96,000 animal species, showcasing its extraordinary biodiversity.     <=>     인도의 다양한 지리적 특성은 그 지역의 독특한 문화, 전통, 언어에 큰 영향을 미쳤습니다. 세계에서 가장 다양한 17개국 중 하나로 인정받는 인도는 47,000종 이상의 식물과 96,000종의 동물을 보유하고 있어 놀라운 생물다양성을 보여줍니다.' },
    { type: "text", content: 'India\'s geographic ecosystems encompass mountain ranges, deserts, plains, plateaus, coasts, and islands, each supporting diverse climates and habitats.    <=>     인도의 지리적 생태계는 산맥, 사막, 평야, 고원, 해안, 섬으로 구성되어 있으며, 각각 다양한 기후와 서식지를 갖추고 있습니다.' },
    { type: "image", content: diversity_img},
    { type: 'text', content: '1. Mountain ranges      <=>     산맥' },
    { type: "text", content: 'The majestic Himalayas in the north, the world\'s tallest mountain range, cradle iconic peaks like Mount Everest and K2, standing as timeless sentinels of nature\'s grandeur. Further enriching India\'s landscape are the verdant Western Ghats, a UNESCO World Heritage Site, and the ancient Aravalli, Vindhyachal, and Satpura ranges, each with its unique ecosystems and geological significance.     <=>     북쪽의 장엄한 히말라야 산맥은 세계에서 가장 높은 산맥으로, 에베레스트 산과 K2와 같은 상징적인 봉우리를 품고 있으며, 자연의 웅장함을 영원히 지키는 파수꾼으로 서 있습니다. 인도의 풍경을 더욱 풍요롭게 하는 것은 유네스코 세계문화유산인 푸른 서부 가츠 산맥과 고유한 생태계와 지질학적 중요성을 지닌 고대 아라발리, 빈드야찰, 사트푸라 산맥입니다. '},
    { type: "image", content: himalaya_ranges_img},
    { type: 'text', content: '2. The Thar Desert      <=>     타르 사막' },
    { type: "text", content: 'The Thar Desert, sprawling across the western expanse of India, stands among the world\'s largest deserts. Its golden dunes and arid landscapes harbor a remarkable diversity of life, from hardy desert flora to unique fauna like the Indian gazelle and the great Indian bustard, thriving in this enchanting yet unforgiving terrain.     <=>     인도의 서쪽 광활한 지역에 펼쳐진 타르 사막은 세계에서 가장 큰 사막 중 하나입니다. 황금빛 모래언덕과 건조한 풍경은 강인한 사막 식물부터 인도 가젤과 인도 큰 황새와 같은 독특한 동물에 이르기까지 놀라울 정도로 다양한 생명체를 품고 있으며, 이 매혹적이면서도 용서 없는 지형에서 번성합니다. '},
    { type: "image", content: thar_desert_img},
    { type: 'text', content: '3. Plains      <=>     평야지대' },
    { type: "text", content: 'The plains of India, primarily formed by the fertile alluvial deposits of major rivers like the Ganga, Brahmaputra, and Indus, stretch across the northern and eastern regions. These vast expanses, known as the Indo-Gangetic Plains, are among the most agriculturally productive areas in the world, supporting dense populations and vibrant cultures.     <=>     인도의 평원은 주로 갠지스, 브라마푸트라, 인더스와 같은 주요 강의 비옥한 충적 퇴적물로 형성되었으며 북부와 동부 지역에 걸쳐 있습니다. 인도-갠지스 평원으로 알려진 이 광대한 지역은 세계에서 가장 농업적으로 생산적인 지역 중 하나이며, 인구 밀도가 높고 활기찬 문화를 지원합니다. '},
    { type: "image", content: plains_img},
    { type: 'text', content: '4. Plateaus      <=>     고원지대' },
    { type: "text", content: 'India\'s plateaus are a testament to the nation\'s diverse topography, characterized by expansive highlands and rich geological history. The Deccan Plateau, stretching across southern India, is the largest, renowned for its volcanic origin and fertile black soil. In central India, the Chota Nagpur Plateau is rich in mineral resources like coal and iron ore, making it a hub for mining. The Malwa Plateau in the west and the Meghalaya Plateau in the northeast add to the variety, with their distinct ecosystems and cultural significance.     <=>     인도의 고원은 광활한 고지대와 풍부한 지질학적 역사를 특징으로 하는 다양한 지형을 증명합니다. 인도 남부에 걸쳐 펼쳐진 데칸 고원은 가장 크고 화산 기원과 비옥한 검은 토양으로 유명합니다. 인도 중부의 초타 나그푸르 고원은 석탄과 철광석과 같은 광물 자원이 풍부하여 광산의 중심지가 되었습니다. 서쪽의 말와 고원과 북동쪽의 메갈라야 고원은 독특한 생태계와 문화적 중요성으로 다양성을 더합니다. '},
    { type: "image", content: plateaus_img},
    { type: 'text', content: '5. Coasts      <=>     해안' },
    { type: "text", content: 'India\'s coastline stretches over 7,500 kilometers, embracing the Arabian Sea to the west, the Bay of Bengal to the east, and the Indian Ocean to the south. The western coast, marked by the Konkan and Malabar coasts, boasts palm-lined beaches, lagoons, and bustling ports. The eastern coast, featuring the Coromandel and Northern Circars, is known for fertile deltas of rivers like the Ganges, Godavari, and Krishna.     <=>     인도의 해안선은 7,500km가 넘으며 서쪽으로는 아라비아해, 동쪽으로는 벵골만, 남쪽으로는 인도양을 포함합니다. 콘칸과 말라바르 해안으로 표시된 서쪽 해안은 야자수가 늘어선 해변, 석호, 번화한 항구를 자랑합니다. 코로만델과 노던 서커스가 있는 동쪽 해안은 갠지스, 고다바리, 크리슈나와 같은 강의 비옥한 삼각주로 유명합니다. '},
    { type: "image", content: coasts_img},
    { type: 'text', content: '6. Islands      <=>     섬들' },
    { type: "text", content: 'India\'s islands are a blend of pristine beauty and ecological significance, spread across two main groups: the Andaman and Nicobar Islands in the Bay of Bengal and the Lakshadweep Islands in the Arabian Sea. The Andaman and Nicobar archipelago, with over 570 islands, boasts lush rainforests, diverse marine life, and indigenous tribes like the Sentinelese. The Lakshadweep Islands, a cluster of 36 coral atolls and reefs, are renowned for their turquoise lagoons and vibrant coral ecosystems. These islands are not only biodiversity hotspots but also vital to India\'s cultural heritage and strategic importance.     <=>     인도의 섬들은 벵골만의 안다만 니코바르 제도와 아라비아해의 락샤드위프 제도라는 두 주요 그룹에 걸쳐 있는 깨끗한 아름다움과 생태적 중요성의 혼합입니다. 570개가 넘는 섬이 있는 안다만 니코바르 군도는 무성한 열대 우림, 다양한 해양 생물, 센티넬족과 같은 토착 부족을 자랑합니다. 36개의 산호 환초와 암초가 모여 있는 락샤드위프 제도는 청록색 석호와 활기찬 산호 생태계로 유명합니다. 이 섬들은 생물다양성의 핫스팟일 뿐만 아니라 인도의 문화 유산과 전략적 중요성에 필수적입니다. '},
    { type: "image", content: islands_img},
    { type: 'text', content: '7. Climates      <=>     기후' },
    { type: "text", content: 'India\'s climate is a mosaic of diversity, shaped by its vast geography. The country experiences six major climatic zones: alpine in the Himalayas, arid in the Thar Desert, subtropical in the Gangetic plains, tropical in the southern regions, and coastal climates along its extensive shoreline. Influenced by the monsoon winds, India witnesses dramatic seasonal changes, from scorching summers and refreshing rains to cool winters. This climatic variety supports a rich tapestry of ecosystems, agriculture, and lifestyles, making India a land of unparalleled climatic contrasts.     <=>     인도의 기후는 광대한 지리로 형성된 다양성의 모자이크입니다. 이 나라는 히말라야의 고산, 타르 사막의 건조, 갠지스 평원의 아열대, 남부 지역의 열대, 그리고 광대한 해안선을 따라 해안 기후의 6개 주요 기후대를 경험합니다. 몬순 바람의 영향을 받아 인도는 뜨거운 여름과 상쾌한 비에서 시원한 겨울까지 극적인 계절 변화를 목격합니다. 이러한 기후적 다양성은 풍부한 생태계, 농업 및 라이프스타일을 지원하여 인도를 비교할 수 없는 기후적 대조의 땅으로 만듭니다. '},
    { type: "image", content: climate_img},
    { type: 'text', content: 'Thank you for your participation.    <=>     참여해 주셔서 감사합니다.'},
    { type: 'text', content: 'ThankYou | 감사합니다' }
];

export default predefinedMessages;