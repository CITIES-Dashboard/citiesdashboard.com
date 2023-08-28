"use strict";(self.webpackChunkfront_end=self.webpackChunkfront_end||[]).push([[28],{547:function(e,t,n){var r=n(4942),o=n(6015),i=n(803),a=n(286),s=n(4565),c=n(7205),d=n(277),l=n(3540),u=n(5536),h=n(1745),m=n(1478),Z=n(1744),f=n(7438),x=n(184);(0,d.ZP)(o.Z)((function(e){var t=e.theme;return(0,r.Z)({filter:"dark"===t.palette.mode&&"invert(0.848) hue-rotate(180deg)",display:"flex",justifyContent:"center",marginTop:t.spacing(2),height:"90vh",maxHeight:"980px"},t.breakpoints.down("sm"),{marginLeft:t.spacing(-2),marginRight:t.spacing(-2)})}));t.Z=function(){return(0,x.jsxs)(i.Z,{children:[(0,x.jsx)(h.Z,{text:(0,Z.F)(m.W5.id)}),(0,x.jsx)(o.Z,{maxWidth:"md",margin:"auto",children:(0,x.jsxs)(a.Z,{elevation:2,sx:{p:3},children:[(0,x.jsx)(s.Z,{variant:"body2",color:"text.secondary",children:(0,l.ZP)(m.W5.k,{replace:Z.T})}),(0,x.jsx)(i.Z,{sx:{mt:3,textAlign:"center"},children:(0,x.jsxs)(c.Z,{href:"".concat("https://docs.google.com/forms/d/e/1FAIpQLScnPA_ohsOvyZoO9QfjNk7shfXEyUGxOfxrpGzXq0VOSxjwbA/","/viewform"),onClick:function(){f.y(f.z.openContactFormInExternalTab)},target:"_blank",rel:"noreferrer",variant:"contained",size:"small",children:[(0,x.jsx)(u.Z,{sx:{fontSize:"1rem"}}),"\xa0 OPEN FORM"]})})]})})]})}},5028:function(e,t,n){n.r(t),n.d(t,{default:function(){return oe}});var r=n(9439),o=n(2791),i=n(3504),a=n(7462),s=n(3366),c=n(8182),d=n(4419),l=n(277),u=n(5513),h=n(286),m=n(5878),Z=n(1217);function f(e){return(0,Z.Z)("MuiCard",e)}(0,m.Z)("MuiCard",["root"]);var x=n(184),p=["className","raised"],v=(0,l.ZP)(h.Z,{name:"MuiCard",slot:"Root",overridesResolver:function(e,t){return t.root}})((function(){return{overflow:"hidden"}})),g=o.forwardRef((function(e,t){var n=(0,u.Z)({props:e,name:"MuiCard"}),r=n.className,o=n.raised,i=void 0!==o&&o,l=(0,s.Z)(n,p),h=(0,a.Z)({},n,{raised:i}),m=function(e){var t=e.classes;return(0,d.Z)({root:["root"]},f,t)}(h);return(0,x.jsx)(v,(0,a.Z)({className:(0,c.Z)(m.root,r),elevation:i?8:void 0,ref:t,ownerState:h},l))})),j=n(4942);function C(e){return(0,Z.Z)("MuiCardActionArea",e)}var b=(0,m.Z)("MuiCardActionArea",["root","focusVisible","focusHighlight"]),y=n(9917),M=["children","className","focusVisibleClassName"],w=(0,l.ZP)(y.Z,{name:"MuiCardActionArea",slot:"Root",overridesResolver:function(e,t){return t.root}})((function(e){var t,n=e.theme;return t={display:"block",textAlign:"inherit",width:"100%"},(0,j.Z)(t,"&:hover .".concat(b.focusHighlight),{opacity:(n.vars||n).palette.action.hoverOpacity,"@media (hover: none)":{opacity:0}}),(0,j.Z)(t,"&.".concat(b.focusVisible," .").concat(b.focusHighlight),{opacity:(n.vars||n).palette.action.focusOpacity}),t})),N=(0,l.ZP)("span",{name:"MuiCardActionArea",slot:"FocusHighlight",overridesResolver:function(e,t){return t.focusHighlight}})((function(e){var t=e.theme;return{overflow:"hidden",pointerEvents:"none",position:"absolute",top:0,right:0,bottom:0,left:0,borderRadius:"inherit",opacity:0,backgroundColor:"currentcolor",transition:t.transitions.create("opacity",{duration:t.transitions.duration.short})}})),k=o.forwardRef((function(e,t){var n=(0,u.Z)({props:e,name:"MuiCardActionArea"}),r=n.children,o=n.className,i=n.focusVisibleClassName,l=(0,s.Z)(n,M),h=n,m=function(e){var t=e.classes;return(0,d.Z)({root:["root"],focusHighlight:["focusHighlight"]},C,t)}(h);return(0,x.jsxs)(w,(0,a.Z)({className:(0,c.Z)(m.root,o),focusVisibleClassName:(0,c.Z)(i,m.focusVisible),ref:t,ownerState:h},l,{children:[r,(0,x.jsx)(N,{className:m.focusHighlight,ownerState:h})]}))}));function P(e){return(0,Z.Z)("MuiCardMedia",e)}(0,m.Z)("MuiCardMedia",["root","media","img"]);var R=["children","className","component","image","src","style"],A=(0,l.ZP)("div",{name:"MuiCardMedia",slot:"Root",overridesResolver:function(e,t){var n=e.ownerState,r=n.isMediaComponent,o=n.isImageComponent;return[t.root,r&&t.media,o&&t.img]}})((function(e){var t=e.ownerState;return(0,a.Z)({display:"block",backgroundSize:"cover",backgroundRepeat:"no-repeat",backgroundPosition:"center"},t.isMediaComponent&&{width:"100%"},t.isImageComponent&&{objectFit:"cover"})})),z=["video","audio","picture","iframe","img"],S=["picture","img"],H=o.forwardRef((function(e,t){var n=(0,u.Z)({props:e,name:"MuiCardMedia"}),r=n.children,o=n.className,i=n.component,l=void 0===i?"div":i,h=n.image,m=n.src,Z=n.style,f=(0,s.Z)(n,R),p=-1!==z.indexOf(l),v=!p&&h?(0,a.Z)({backgroundImage:'url("'.concat(h,'")')},Z):Z,g=(0,a.Z)({},n,{component:l,isMediaComponent:p,isImageComponent:-1!==S.indexOf(l)}),j=function(e){var t=e.classes,n={root:["root",e.isMediaComponent&&"media",e.isImageComponent&&"img"]};return(0,d.Z)(n,P,t)}(g);return(0,x.jsx)(A,(0,a.Z)({className:(0,c.Z)(j.root,o),as:l,role:!p&&h?"img":void 0,ref:t,style:v,ownerState:g,src:p?h||m:void 0},f,{children:r}))}));function O(e){return(0,Z.Z)("MuiCardContent",e)}(0,m.Z)("MuiCardContent",["root"]);var V=["className","component"],I=(0,l.ZP)("div",{name:"MuiCardContent",slot:"Root",overridesResolver:function(e,t){return t.root}})((function(){return{padding:16,"&:last-child":{paddingBottom:24}}})),F=o.forwardRef((function(e,t){var n=(0,u.Z)({props:e,name:"MuiCardContent"}),r=n.className,o=n.component,i=void 0===o?"div":o,l=(0,s.Z)(n,V),h=(0,a.Z)({},n,{component:i}),m=function(e){var t=e.classes;return(0,d.Z)({root:["root"]},O,t)}(h);return(0,x.jsx)(I,(0,a.Z)({as:i,className:(0,c.Z)(m.root,r),ownerState:h,ref:t},l))})),E=n(6015),_=n(803),W=n(5953),L=n(1872),T=n(4565),B=n(4162),G=n(5814),Q=n(4853),U=n(9161),X=n(5973),q=n(9257),D=n(445),J=n(1745),K=n(6344),Y=n(3540),$=n(1478),ee=n(1744);var te=function(){return(0,x.jsxs)(_.Z,{children:[(0,x.jsx)(J.Z,{text:(0,ee.F)($.jZ.id)}),(0,x.jsx)(W.ZP,{container:!0,spacing:3,children:$.jZ.k.map((function(e,t){return(0,x.jsx)(W.ZP,{item:!0,xs:12,md:6,children:(0,x.jsx)(h.Z,{elevation:2,sx:{p:3},children:(0,x.jsx)(T.Z,{variant:"body2",color:"text.secondary",children:(0,Y.ZP)(e,{replace:ee.T})})})},t)}))})]})},ne=n(547),re=n(7438);var oe=function(e){e.themePreference;var t=e.title;(0,o.useEffect)((function(){document.title=t}),[t]);var n=(0,o.useContext)(X.F),a=(0,r.Z)(n,4),s=(a[0],a[1]),c=(a[2],a[3]),d=(0,o.useContext)(q.R),l=(0,r.Z)(d,1)[0],u=(0,o.useContext)(D.c),h=(0,r.Z)(u,1)[0];return(0,o.useEffect)((function(){s("home"),c([])}),[s,c]),(0,x.jsxs)(E.Z,{width:"100%",children:[(0,x.jsx)(K.Z,{children:(0,x.jsxs)(_.Z,{sx:{pt:3,pb:4},children:[(0,x.jsx)(J.Z,{text:"all projects"}),(0,x.jsx)(W.ZP,{container:!0,spacing:3,sx:{justifyContent:{sm:"center",md:"start"}},children:Object.entries(l).map((function(e,t){var n=(0,r.Z)(e,2),o=n[0],a=n[1];return(0,x.jsx)(W.ZP,{item:!0,xs:12,sm:9,md:6,lg:4,children:(0,x.jsx)(g,{elevation:2,children:(0,x.jsxs)(k,{component:i.rU,to:"/project/".concat(a.id),disabled:!a.isActive,onClick:function(){re.y(re.z.internalNavigation,{destination_id:"/project/".concat(a.id),destination_label:a.id,origin_id:"home"})},children:[(0,x.jsx)(H,{height:"auto",sx:{aspectRatio:"4/3",pointerEvents:"none"},children:a.graph}),(0,x.jsx)(L.Z,{}),(0,x.jsx)(F,{children:(0,x.jsxs)(W.ZP,{container:!0,justifyContent:"space-between",alignItems:"end",children:[(0,x.jsxs)(W.ZP,{item:!0,children:[(0,x.jsx)(T.Z,{variant:"body1",component:"div",color:"text.primary",fontWeight:"500",children:a.title}),(0,x.jsx)(T.Z,{variant:"caption",color:"text.secondary",children:a.owner})]}),a.isActive&&(0,x.jsx)(W.ZP,{item:!0,children:(0,x.jsxs)(B.Z,{direction:"row",spacing:1.5,children:[(0,x.jsx)(G.Z,{title:"Number of Charts",children:(0,x.jsxs)(B.Z,{direction:"row",spacing:.2,alignItems:"center",children:[(0,x.jsx)(Q.Z,{sx:{fontSize:"0.75rem",color:"text.secondary"}}),(0,x.jsx)(T.Z,{variant:"caption",color:"text.secondary",children:a.chartCounts})]})}),null!=h[o]&&(0,x.jsx)(G.Z,{title:"Number of Comments",children:(0,x.jsxs)(B.Z,{direction:"row",spacing:.2,alignItems:"center",children:[(0,x.jsx)(U.Z,{sx:{fontSize:"0.75rem",color:"text.secondary"}}),(0,x.jsx)(T.Z,{variant:"caption",color:"text.secondary",children:h[o]})]})})]})})]})})]})})},t)}))})]})}),(0,x.jsx)(L.Z,{}),(0,x.jsx)(K.Z,{id:$.jZ.id,sx:{pt:3,pb:4},children:(0,x.jsx)(te,{})}),(0,x.jsx)(L.Z,{}),(0,x.jsx)(K.Z,{id:$.W5.id,sx:{pt:3,pb:4},children:(0,x.jsx)(ne.Z,{})})]})}},4853:function(e,t,n){var r=n(4836);t.Z=void 0;var o=r(n(5649)),i=n(184),a=(0,o.default)((0,i.jsx)("path",{d:"M4 9h4v11H4zm12 4h4v7h-4zm-6-9h4v16h-4z"}),"BarChart");t.Z=a},5536:function(e,t,n){var r=n(4836);t.Z=void 0;var o=r(n(5649)),i=n(184),a=(0,o.default)((0,i.jsx)("path",{d:"M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"}),"Launch");t.Z=a}}]);
//# sourceMappingURL=28.985a4311.chunk.js.map