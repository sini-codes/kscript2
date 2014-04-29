shared interface GUIItem{
	void draw();
	void addChild(GUIItem@ child);
	void removeChild(GUIItem@ child);
	void setOffset(Vec2f _offset);
	void setEnabled(bool enabled);
	bool isEnabled();
	bool isHovered();
	bool isClicked();
}

shared class GenericGUIItem : GUIItem{
	
	//common
	bool enabled = true;
	
	//Visual stuff
	Vec2f position;
	Vec2f size;
	Vec2f offset;

	//Composite
	GUIItem@[] children;
	
	//Mouse magic
	bool clickFrameResult = false;
	bool clickFrameCheck = false;
	bool clickRegistered = false;

	GenericGUIItem(Vec2f _position,Vec2f _size){
		position = _position;
		size = _size;
	}

	void draw(){
		if(getControls().isKeyJustReleased(KEY_LBUTTON)){
			clickRegistered = false;
		}

		clickFrameCheck = false;
		for(int i = 0; i < children.length; i++){
			if(!children[i].isEnabled()) continue;
			children[i].setOffset(offset+position);
			children[i].draw();
		}
	}

	void addChild(GUIItem@ child){
		children.push_back(child);
	}

	void setOffset(Vec2f _offset){
		offset = _offset;
	}

	void removeChild(GUIItem@ child){
		int ndx = children.find(child);
		if(ndx>-1)
			children.removeAt(ndx);
	}

	//TODO: Should be optimized to cache the results prolly. Same for isClicked
	bool isHovered(){
		CControls@ controls = getControls();
		Vec2f mouseScrPos= getControls().getMouseScreenPos();
		Vec2f lt = offset+position;
		Vec2f br = offset+position+size;
		return 
			mouseScrPos.x >= lt.x && 
			mouseScrPos.x <=br.x &&
			mouseScrPos.y >= lt.y && 
			mouseScrPos.y <=br.y;

	}

	bool isClicked(){
		if(clickFrameCheck){
			return clickFrameResult;
		}
		clickFrameCheck = true;

		clickRegistered = !clickRegistered && 
					isHovered() && 
					getControls().isKeyJustPressed(KEY_LBUTTON);
		clickFrameResult = clickRegistered;

		return clickFrameResult;
	}

	void setEnabled(bool _enabled){
		enabled = _enabled;
	}

	bool isEnabled(){
		return enabled;
	}

}

shared class Window : GenericGUIItem{
	
	Window(Vec2f _position,Vec2f _size){
		super(_position,_size);
	}

	void draw(){
		GUI::DrawWindow(offset + position, offset+position+size);
		GenericGUIItem::draw();
	}

}

shared class Button : GenericGUIItem{

	Button(Vec2f _position,Vec2f _size){
		super(_position,_size);
	}

	void draw(){
		if(isClicked()){
			GUI::DrawButtonPressed(offset + position, offset+position+size);	
		} else if(isHovered()){
			GUI::DrawButtonHover(offset + position, offset+position+size);
		} else {
			GUI::DrawButton(offset + position, offset+position+size);	
		}
		GenericGUIItem::draw();
	}

}

shared class ProgressBar : GenericGUIItem{
	
	float val;

	ProgressBar(Vec2f _position,Vec2f _size, float _initVal){
		super(_position,_size);
		val = _initVal;
	}

	void draw(){
		GUI::DrawProgressBar(offset + position, offset+position+size, val);
		GenericGUIItem::draw();
	}

	void setVal(float _val){
		val = _val;
	}

}

shared class Rectangle : GenericGUIItem{
	
	bool useColor = false;
	SColor color;

	Rectangle(Vec2f _position,Vec2f _size, SColor _color){
		super(_position,_size);
		color = _color;
		useColor = true;
	}

	Rectangle(Vec2f _position,Vec2f _size ){
		super(_position,_size);
	}

	void draw(){
		if(useColor)
			GUI::DrawRectangle(offset + position, offset+position+size,color);
		else
			GUI::DrawRectangle(offset + position, offset+position+size);
		GenericGUIItem::draw();
	}

}

shared class Bubble : GenericGUIItem{
	
	Bubble(Vec2f _position,Vec2f _size){
		super(_position,_size);
	}

	void draw(){
		GUI::DrawBubble(offset + position, offset+position+size);
		GenericGUIItem::draw();
	}

}

shared class Line : GenericGUIItem{
	
	SColor color;

	Line(Vec2f _position,Vec2f _size, SColor _color){
		super(_position,_size);
		color = _color;
	}

	void draw(){
		GUI::DrawLine2D(offset + position, offset+position+size, color);
		GenericGUIItem::draw();
	}

}

shared class Label : GenericGUIItem{
	
	string label;
	SColor color;
	Label(Vec2f _position,Vec2f _size,string _label,SColor _color){
		super(_position,_size);
		label = _label;
		color = _color;
	}

	void draw(){
		//GUI::DrawText(label,offset + position,offset+position+size,color,false,false);
		drawRulesFont(label,color,offset + position,offset+position+size,false,false);
		GenericGUIItem::draw();
	}

	void setText(string _label){
		label = _label;
	}

}


shared class Icon : GenericGUIItem{
	
	string name;
	float scale;
	Icon(Vec2f _position,Vec2f _size,string _name, float _scale = 1){
		super(_position,_size);
		name = _name;	
		scale = _scale;
	}

	void draw(){
		GUI::DrawIconByName(name,offset + position,scale);
		GenericGUIItem::draw();
	}

}
